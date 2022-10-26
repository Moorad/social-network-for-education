import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import multer from 'multer';

import User, { IUserSafe } from './Models/User';
import {
	mediaExists,
	multerFileFilter,
	multerWriteMedia,
} from './file_manager/file_manager';

dotenv.config();

const SALT_ROUNDS = 10;
const upload = multer({
	storage: multerWriteMedia(),
	fileFilter: multerFileFilter,
}).single('file');

if (process.env.DB) {
	mongoose.connect(process.env.DB);
} else {
	throw 'No database URI environment variable configured';
}

if (process.env.SECRET_TOKEN === undefined) {
	throw 'No secret access token provided';
}

mongoose.connection.on('connected', () => {
	console.log('Database successfully connected to ' + process.env.DB);
});

const app = express();

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.listen(process.env.PORT || '4000', () => {
	console.log(`Server listening on port ${process.env.PORT || '4000'}`);
});

app.post('/api/auth/register', (req, res) => {
	bcrypt.hash(req.body.password, SALT_ROUNDS, async (err, hash) => {
		if (err) {
			res.statusCode = 500;
			return res.json({
				message: err.message,
			});
		}

		const user = new User({
			displayName: req.body.displayName,
			email: req.body.email,
			password: hash,
		});

		try {
			await user.save();
		} catch (dbErr) {
			if ((dbErr as MongoServerError).code == 11000) {
				res.statusCode = 403;
				res.json({
					message: 'Email is already registered',
				});
			} else {
				res.statusCode = 500;
				res.json({
					message: (dbErr as Error).message,
				});
			}

			return;
		}

		const payload = {
			id: user._id.toString(),
		};
		const accessToken = jwt.sign(payload, process.env.SECRET_TOKEN || '');

		res.json({
			accessToken: accessToken,
		});
	});
});

app.post('/api/auth/login', async (req, res) => {
	const user = await User.findOne({ email: req.body.email }).exec();
	if (user) {
		// User exists
		bcrypt.compare(req.body.password, user.password, (err, result) => {
			if (err) {
				res.statusCode = 500;
				res.json({
					message: err.message,
				});
				return;
			}

			if (result) {
				// Credentials correct
				const payload = {
					id: user._id.toString(),
				};
				const accessToken = jwt.sign(
					payload,
					process.env.SECRET_TOKEN || ''
				);

				res.cookie('token', accessToken, {
					httpOnly: true,
					secure: false,
					maxAge: 2592000000, // 30 days
				});
				res.json({
					accessToken: accessToken,
				});
			} else {
				res.statusCode = 403;
				res.json({
					message: 'Invalid credentials',
				});
			}
		});
	} else {
		res.statusCode = 403;
		res.json({
			message: 'Invalid credentials',
		});
	}
});

app.get('/api/auth/logout', (req, res) => {
	res.clearCookie('token');
	res.json({
		message: 'ok',
	});
});

app.get('/api/image/:id', (req, res) => {
	mediaExists(req.params.id, 'png')
		.then((path) => {
			res.sendFile(path);
		})
		.catch((err) => {
			res.statusCode = 404;
			res.json({
				message: err,
			});
		});
});

// Authentication middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const authCookie: string = req.cookies['token'];

	if (!authCookie) {
		res.statusCode = 401;
		return res.json({
			message: 'No authentication token provided',
		});
	}

	jwt.verify(authCookie, process.env.SECRET_TOKEN || '', (err, user) => {
		if (err) {
			res.statusCode = 403;
			res.clearCookie('token');
			return res.json({
				message: 'Invalid authentication token',
			});
		}

		res.locals.user = user;
		next();
	});
}

app.get('/api/auth/token', authenticateToken, (req, res) => {
	res.statusCode = 200;
	res.json({
		message: 'ok',
	});
});

app.get('/api/user', authenticateToken, async (req, res) => {
	let userId;

	if (req.query.id) {
		userId = req.query.id;
	} else {
		userId = res.locals.user.id;
	}

	try {
		const doc = await User.findById(userId).exec();

		if (doc) {
			const user: IUserSafe = {
				displayName: doc.displayName,
				description: doc.description,
				label: doc.label,
				followerCount: doc.followerCount,
				followingCount: doc.followingCount,
				posts: doc.posts,
				avatar: doc.avatar,
				_id: doc._id,
			};
			return res.json(user);
		}
	} catch (err) {
		res.statusCode = 404;
		return res.json({
			message: 'User was not found',
		});
	}
});

app.post('/api/upload', authenticateToken, (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.statusCode = 400;
			return res.json({
				message: 'unable to upload',
			});
		}

		const URL =
			'http://localhost:4000/api/image/' +
			req.file?.filename.slice(0, -4);

		User.findByIdAndUpdate(res.locals.user.id, { avatar: URL }, (err) => {
			if (err) {
				res.statusCode = 404;
				return res.json({
					message: 'An error occured',
				});
			}

			return res.send({
				url: URL,
			});
		});
	});
});

app.get('/api/search', authenticateToken, async (req, res) => {
	const term = req.query['term'];

	try {
		if (typeof term === 'string') {
			const docs = await User.find({
				$text: {
					$search: term,
				},
			})
				.limit(5)
				.exec();

			const users = [];
			if (docs) {
				for (let i = 0; i < docs.length; i++) {
					users.push({
						displayName: docs[i].displayName,
						_id: docs[i]._id,
						avatar: docs[i].avatar,
					});
				}
			}

			return res.json({
				results: users,
			});
		}

		res.statusCode = 400;
		return res.json({
			message: 'invalid query type',
		});
	} catch (err) {
		res.json({
			results: [],
		});
	}
});
