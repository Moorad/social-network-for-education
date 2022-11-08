import fs from 'fs/promises';
import path from 'path';

export async function resetFiles() {
	const skipFiles = [
		'default.png',
		'd741bf93-672a-4b04-83ad-fbb90009f211.png',
		'70bb12c5-5084-4f73-8302-451a2764e3e2.png',
	];
	const mediaFolder = path.resolve(__dirname, '../../file_manager/media');
	const files = await fs.readdir(mediaFolder);

	for (let i = 0; i < files.length; i++) {
		if (!skipFiles.includes(files[i])) {
			await fs.unlink(path.join(mediaFolder, files[i]));
			console.log(`The file ${files[i]} has been deleted.`);
		} else {
			console.log(`The file ${files[i]} has been skipped.`);
		}
	}

	console.log('File reset complete.');
}
