import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import postsRouter from './routes/post';
import resourceRouter from './routes/resource';
import utilsRouter from './routes/utils';
import { startUpCheck } from './utils/start_up';

const fullLogs = false;

// This will make sure process.env.DB and process.env.DB_NAME are set
startUpCheck();

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
			if (process.env.NODE_ENV === 'test') return true;
			if (fullLogs) return false;

			if (req.path == '/utils/search') return true;

			return false;
		},
	})
);
app.use(cookieParser());

// routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/post', postsRouter);
app.use('/resource', resourceRouter);
app.use('/utils', utilsRouter);

export default app;
