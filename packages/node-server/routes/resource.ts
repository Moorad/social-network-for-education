import express, { Request, Response } from 'express';
import { authenticateToken } from './auth';
import fs from 'fs/promises';
import path from 'path';
import {
	mediaExists,
	multerFileFilter,
	multerWriteMedia,
} from '../file_manager/file_manager';
import multer from 'multer';
import User from '../Models/User';
import { uploadFile, ObjectIDInQuery, validate } from '../utils/validation';
import { CallbackError } from 'mongoose';
import { processImage } from '../file_manager/utils/processing';
const router = express.Router();
const upload = multer({
	storage: multerWriteMedia(),
	fileFilter: multerFileFilter,
}).single('file');

const anyFileUpload = multer({
	storage: multerWriteMedia(),
}).single('file');

router.get('/avatar', validate(ObjectIDInQuery), async (req, res) => {
	try {
		const user = await User.findById(req.query.id).exec();

		if (user == null) {
			return res.sendStatus(404);
		}

		return res.redirect(user.avatar);
	} catch {
		return res.sendStatus(404);
	}
});

router.post(
	'/upload',
	[validate(uploadFile), authenticateToken],
	(req: Request, res: Response) => {
		upload(req, res, async (err) => {
			if (!req.file) {
				return res.sendStatus(400);
			}

			if (err) {
				return res.sendStatus(400);
			}

			const URL =
			`${process.env.EXPRESS_URL}/resource/` +
				path.basename(
					req.file.filename,
					path.extname(req.file.filename)
				);

			const buf = await fs.readFile(
				path.resolve(__dirname, '../../', req.file.path)
			);
			let updateQuery = {};

			if (req.query.for == 'Avatar') {
				await processImage(buf, 512, 512, req.file.filename);
				updateQuery = { avatar: URL };
			} else if (req.query.for == 'Profile_Background') {
				await processImage(buf, 1920, 438, req.file.filename);
				updateQuery = { background: URL };
			} else if (req.query.for == 'Other_Image') {
				// Image pre-processing should happen here
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

router.post(
	'/upload_attachment',
	[authenticateToken],
	(req: Request, res: Response) => {
		anyFileUpload(req, res, async (err) => {
			if (!req.file) {
				return res.sendStatus(400);
			}

			if (err) {
				return res.sendStatus(400);
			}

			const URL =
				`${process.env.EXPRESS_URL}/resource/` +
				path.basename(
					req.file.filename,
					path.extname(req.file.filename)
				);

			return res.json({
				name: req.file.originalname,
				mime: req.file.mimetype,
				size: req.file.size,
				url: URL,
			});
		});
	}
);

router.get('/:id', (req, res) => {
	mediaExists(req.params.id)
		.then((path) => {
			res.sendFile(path);
		})
		.catch(() => {
			res.sendStatus(404);
		});
});
export default router;
