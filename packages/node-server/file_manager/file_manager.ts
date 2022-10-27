import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import mime from 'mime-types';

const ALLOWED_FILE_TYPES = ['png', 'jpg', 'jpeg'];

export async function mediaExists(filename: string) {
	try {
		const parentFolder = path.join(
			__dirname,
			'../..',
			'./file_manager/media'
		);
		const files = await fs.readdir(parentFolder);
		const filter = files.filter(
			(f) =>
				path.basename(f, path.extname(f)) == filename &&
				ALLOWED_FILE_TYPES.includes(path.extname(f).slice(1))
		);
		return path.join(parentFolder, filter[0]);
	} catch (err) {
		throw 'File could not be found';
	}
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
	if (ALLOWED_FILE_TYPES.includes(mime.extension(file.mimetype) || '')) {
		return cb(null, true);
	}
	// To reject this file pass `false`, like so:
	cb(new Error('File type not allowed'));
}
