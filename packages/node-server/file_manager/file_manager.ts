import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import mime from 'mime-types';

export function mediaExists(filename: string, fileExtension: string) {
	return new Promise<string>((resolve, reject) => {
		const resolvedPath = path.join(
			__dirname,
			'../..',
			'./file_manager/media',
			`./${filename}.${fileExtension}`
		);
		fs.stat(resolvedPath, (err) => {
			if (err == null) {
				resolve(resolvedPath);
			} else {
				console.log(err);
				reject('File could not be resolved');
			}
		});
	});
}

export function multerWriteMedia() {
	return multer.diskStorage({
		destination: './file_manager/media',
		filename: function (req, file, cb) {
			const filename = uuidv4();

			cb(null, `${filename}.${mime.extension(file.mimetype)}`);
		},
	});
}

export function multerFileFilter(
	req: Express.Request,
	file: Express.Multer.File,
	cb: multer.FileFilterCallback
) {
	const allowedExtensions = ['png'];

	if (allowedExtensions.includes(mime.extension(file.mimetype) || '')) {
		return cb(null, true);
	}
	// To reject this file pass `false`, like so:
	cb(new Error('File type not allowed'));
}

export function writeMedia(fileContent: string, fileExtention: string) {
	return new Promise<string>((resolve, reject) => {
		const resolvedPath = path.join(
			__dirname,
			'../..',
			'./file_manager/media',
			`./${uuidv4()}.${fileExtention}`
		);
	});
}
// function writeImage() {}
