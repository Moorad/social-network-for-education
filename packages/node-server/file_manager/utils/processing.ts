import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

async function processImage(
	imageBuffer: Buffer,
	width: number,
	height: number
) {
	// Crop image to aspect ratio
	sharp(imageBuffer)
		.resize({
			fit: sharp.fit.cover,
			width: width,
			height: height,
		})
		.toFile('file_manager/media/out.png');

	// Possibly: Compress image if its too big
}

fs.readFile(
	path.resolve(
		__dirname,
		'../../../file_manager/media/8674ff43-bcf6-4afe-a7ef-1df55502b293.jpeg'
	)
).then((image) => {
	processImage(image, 512, 512);
});
