import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';
import bycrypt from 'bcrypt';

import User from './Models/User';

dotenv.config();

const SALT_ROUNDS = 10;

if (process.env.DB) {
	mongoose.connect(process.env.DB);
} else {
	throw 'No database URI environment variable configured';
}

mongoose.connection.on('connected', () => {
	console.log('Database successfully connected to ' + process.env.DB);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.listen(process.env.PORT || '4000', () => {
	console.log(`Server listening on port ${process.env.PORT || '4000'}`);
});

app.post('/api/register', (req, res) => {
	bycrypt.hash(req.body.password, SALT_ROUNDS, async (err, hash) => {
		if (err) {
			res.statusCode = 500;
			res.json({
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

		res.json({
			message: 'ok',
		});
	});
});

app.post('/api/login', async (req, res) => {
	const user = await User.findOne({ email: req.body.email }).exec();

	if (user) {
		bycrypt.compare(req.body.password, user.password, (err, result) => {
			if (err) {
				res.statusCode = 500;
				res.json({
					message: err.message,
				});
				return;
			}

			if (result) {
				res.json({
					message: 'ok',
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
