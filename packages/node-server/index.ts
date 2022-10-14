import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose, { Types } from 'mongoose';
import { MongoServerError } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import User from './Models/User';

dotenv.config();

const SALT_ROUNDS = 10;

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
		origin: true,
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
		const accessToken = jwt.sign(payload, process.env.SECRET_TOKEN!);

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
					process.env.SECRET_TOKEN!
				);

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

// app.get('/api/auth/token', (req, res) => {
// 	if (req.cookies.token) {
// 		return res.json({
// 			exists: true,
// 		});
// 	}

// 	return res.json({
// 		exists: false,
// 	});
// });

// Authentication middleware
function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];

	if (!authHeader) {
		res.statusCode = 401;
		return res.json({
			message: 'No authentication token provided',
		});
	}

	const token = authHeader.split(' ')[1];

	jwt.verify(token, process.env.SECRET_TOKEN!, (err: any, user: any) => {
		if (err) {
			res.statusCode = 403;
			return res.json({
				message: 'Invalid authentication token',
			});
		}

		res.locals.user = user;
		next();
	});
}

app.get('/api/user', authenticateToken, async (req, res) => {
	// const id = new Types.ObjectId();
	const user = await User.findById(res.locals.user.id).exec();

	if (user) {
		return res.json({
			displayName: user.displayName,
		});
	}

	res.statusCode = 404;
	return res.json({
		message: 'User was not found',
	});
});
