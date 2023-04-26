import express, { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import '../utils/passport';
import { LocalLogin, LocalRegister, validate } from '../utils/validation';
import Login from '../Models/Login';

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

			const accessToken = createJWTToken(res, user.userId.toString());

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

		data.user.displayName = req.body.displayName;

		try {
			const check = await Login.findOne({
				email: data.login.email,
			});

			if (check != null) {
				return res.sendStatus(409);
			}

			await data.login.save();
			await data.user.save();
		} catch (err) {
			return res.sendStatus(409);
		}

		const accessToken = createJWTToken(res, data.login.userId.toString());

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

		createJWTToken(res, req.user.toString());

		return res.redirect(`${process.env.REACT_URL}/home`);
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

		createJWTToken(res, req.user.toString());

		return res.redirect(`${process.env.REACT_URL}/home`);
	}
);

router.get('/logout', (req, res) => {
	res.clearCookie('token');
	res.sendStatus(200);
});

router.get('/token', authenticateToken, (req, res) => {
	res.sendStatus(200);
});

// Authentication middleware
export function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authCookie: string = req.cookies['token'];

	if (!authCookie) {
		return res.sendStatus(401);
	}

	jwt.verify(authCookie, process.env.SECRET_TOKEN || '', (err, user) => {
		if (err) {
			res.clearCookie('token');
			return res.sendStatus(403);
		}

		res.locals.user = user;
		next();
	});
}

export function createJWTToken(res: Response, userId: string) {
	const payload = {
		id: userId,
	};

	const accessToken = jwt.sign(payload, process.env.SECRET_TOKEN || '');

	res.cookie('token', accessToken, {
		httpOnly: true,
		secure: false,
		maxAge: 2592000000, // 30 days
	});

	return accessToken;
}

export default router;
