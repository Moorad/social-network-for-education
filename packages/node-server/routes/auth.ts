import express, { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../Models/User';
import { MongoServerError } from 'mongodb';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SALT_ROUNDS = 10;

router.post('/register', (req, res) => {
	if (!req.body.displayName || !req.body.email || !req.body.password) {
		return res.sendStatus(400);
	}

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

		res.cookie('token', accessToken, {
			httpOnly: true,
			secure: false,
			maxAge: 2592000000, // 30 days
		});

		res.json({
			accessToken: accessToken,
		});
	});
});

router.post('/login', async (req, res) => {
	if (!req.body.email || !req.body.password) {
		return res.sendStatus(400);
	}

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

router.get('/logout', (req, res) => {
	res.clearCookie('token');
	res.json({
		message: 'ok',
	});
});

router.get('/token', authenticateToken, (req, res) => {
	res.statusCode = 200;
	res.json({
		message: 'ok',
	});
});

// Authentication middleware
export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
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

export default router;
