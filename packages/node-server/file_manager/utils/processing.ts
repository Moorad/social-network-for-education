import path from 'path';
import sharp from 'sharp';

export function processImage(
	imageBuffer: Buffer,
	width: number,
	height: number,
	filename: string
) {
	return new Promise<void>((resolve, reject) => {
		sharp(imageBuffer)
			.resize({
				fit: sharp.fit.cover,
				width: width,
				height: height,
			})
			.toFile(
				path.resolve(
					__dirname,
					`../../../file_manager/media/${filename}`
				)
			)
			.then(() => resolve())
			.catch(() => reject());
	});
}
