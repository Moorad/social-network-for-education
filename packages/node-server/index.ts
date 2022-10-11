import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
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
				message: err.message
			});
		}

		const user = new User({
			displayName: req.body.displayName,
			email: req.body.email,
			password: hash
		});

		await user.save();

		res.json({
			message: 'ok',
		});
	});
});
