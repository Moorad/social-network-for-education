import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import '../utils/passport';
import { LocalLogin, LocalRegister, validate } from '../utils/validation';

const router = express.Router();

router.post('/login', validate(LocalLogin), (req, res, next) => {
	passport.authenticate('login', { session: false }, (err, user, info) => {
		if (err || !user) {
			if (info && info.message == 'Invalid email or password') {
				return res.sendStatus(403);
			}

			return res.sendStatus(400);
		}

		req.login(user, { session: false }, (err) => {
			if (err) {
				return res.sendStatus(500);
			}

			const payload = {
				id: user.userId.toString(),
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
				token: accessToken,
			});
		});
	})(req, res, next);
});

router.post('/register', validate(LocalRegister), (req, res, next) => {
	passport.authenticate('register', { session: false }, async (err, data) => {
		if (err || !data) {
			return res.sendStatus(400);
		}

		if (!req.body.displayName) {
			return res.sendStatus(400);
		}

		data.user.displayName = req.body.displayName;

		try {
			await data.login.save();
			await data.user.save();
		} catch (err) {
			return res.sendStatus(409);
		}

		const payload = {
			id: data.login.userId.toString(),
		};

		const accessToken = jwt.sign(payload, process.env.SECRET_TOKEN || '');

		res.cookie('token', accessToken, {
			httpOnly: true,
			secure: false,
			maxAge: 2592000000, // 30 days
		});

		return res.json({
			token: accessToken,
		});
	})(req, res, next);
});

router.get('/google', passport.authenticate('google'));

router.get(
	'/google/callback',
	passport.authenticate('google', { session: false }),
	(req, res) => {
		if (!req.user) {
			return res.sendStatus(404);
		}

		const payload = {
			id: req.user.toString(),
		};

		const accessToken = jwt.sign(payload, process.env.SECRET_TOKEN || '');

		res.cookie('token', accessToken, {
			httpOnly: true,
			secure: false,
			maxAge: 2592000000, // 30 days
		});

		return res.redirect('http://localhost:3000/home');
	}
);

router.get('/facebook', passport.authenticate('facebook'));

router.get(
	'/facebook/callback',
	passport.authenticate('facebook', { session: false }),
	(req, res) => {
		if (!req.user) {
			return res.sendStatus(404);
		}

		const payload = {
			id: req.user.toString(),
		};

		const accessToken = jwt.sign(payload, process.env.SECRET_TOKEN || '');

		res.cookie('token', accessToken, {
			httpOnly: true,
			secure: false,
			maxAge: 2592000000, // 30 days
		});

		return res.redirect('http://localhost:3000/home');
	}
);

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
