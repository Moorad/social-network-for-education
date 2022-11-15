import express from 'express';
import { authenticateToken } from './auth';
import path from 'path';
import {
	mediaExists,
	multerFileFilter,
	multerWriteMedia,
} from '../file_manager/file_manager';
import multer from 'multer';
import User from '../Models/User';
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

router.post('/upload', authenticateToken, (req, res) => {
	upload(req, res, (err) => {
		if (!req.file) {
			return res.sendStatus(400);
		}

		if (err) {
			return res.sendStatus(400);
		}

		const URL =
			'http://localhost:4000/resource/' +
			path.basename(req.file.filename, path.extname(req.file.filename));

		User.findByIdAndUpdate(res.locals.user.id, { avatar: URL }, (err) => {
			if (err) {
				return res.sendStatus(404);
			}

			return res.send({
				url: URL,
			});
		});
	});
});

export default router;
