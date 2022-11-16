import express, { Request, Response } from 'express';
import { authenticateToken } from './auth';
import path from 'path';
import {
	mediaExists,
	multerFileFilter,
	multerWriteMedia,
} from '../file_manager/file_manager';
import multer from 'multer';
import User from '../Models/User';
import { uploadFile, validate } from '../utils/validation';
import { CallbackError } from 'mongoose';
const router = express.Router();
const upload = multer({
	storage: multerWriteMedia(),
	fileFilter: multerFileFilter,
}).single('file');

router.get('/:id', (req, res) => {
	mediaExists(req.params.id)
		.then((path) => {
			res.sendFile(path);
		})
		.catch(() => {
			res.sendStatus(404);
		});
});

router.post(
	'/upload',
	[validate(uploadFile), authenticateToken],
	(req: Request, res: Response) => {
		upload(req, res, (err) => {
			if (!req.file) {
				return res.sendStatus(400);
			}

			if (err) {
				return res.sendStatus(400);
			}

			const URL =
				'http://localhost:4000/resource/' +
				path.basename(
					req.file.filename,
					path.extname(req.file.filename)
				);

			let updateQuery = {};

			if (req.query.for == 'Avatar') {
				updateQuery = { avatar: URL };
			} else if (req.query.for == 'Profile_Background') {
				updateQuery = { background: URL };
			}

			User.findByIdAndUpdate(
				res.locals.user.id,
				updateQuery,
				(err: CallbackError) => {
					if (err) {
						return res.sendStatus(404);
					}

					return res.send({
						url: URL,
					});
				}
			);
		});
	}
);

export default router;
