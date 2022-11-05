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
		.catch((err) => {
			res.statusCode = 404;
			res.json({
				message: err,
			});
		});
});

router.post('/upload', authenticateToken, (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			res.statusCode = 400;
			return res.json({
				message: 'unable to upload',
			});
		}

		const URL =
			'http://localhost:4000/resource/' +
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			path.basename(req.file!.filename, path.extname(req.file!.filename));

		User.findByIdAndUpdate(res.locals.user.id, { avatar: URL }, (err) => {
			if (err) {
				res.statusCode = 404;
				return res.json({
					message: 'An error occured',
				});
			}

			return res.send({
				url: URL,
			});
		});
	});
});

export default router;
