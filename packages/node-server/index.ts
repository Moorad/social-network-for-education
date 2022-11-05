import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import userRouter from './routes/user';
import postsRouter from './routes/posts';
import resourceRouter from './routes/resource';
import utilsRouter from './routes/utils';

dotenv.config();

const fullLogs = false;

if (process.env.DB && process.env.DB_NAME) {
	mongoose.connect(process.env.DB + process.env.DB_NAME);
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
app.use(
	morgan('dev', {
		skip(req) {
			if (fullLogs) return false;

			if (req.path == '/utils/search') return true;

			return false;
		},
	})
);
app.use(cookieParser());

app.listen(process.env.PORT || '4000', () => {
	console.log(`Server listening on port ${process.env.PORT || '4000'}`);
});

// routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/post', postsRouter);
app.use('/resource', resourceRouter);
app.use('/utils', utilsRouter);
