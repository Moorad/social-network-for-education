import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectToDB, populateWithFakeData, resetDB } from './database';
import { resetFiles } from './files';

dotenv.config();

let DB_NAME = '/test';

async function main() {
	let args = process.argv.slice(2);

	if (args[0] == 'database') {
		args = args.slice(1);

		// Before connection arguments
		if (args[0] == '--db-name') {
			args.shift();
			if (args[0]) {
				DB_NAME = args[0];
			} else {
				console.log('Invalid DB name');
				return;
			}
		}

		await connectToDB(DB_NAME);

		// After connection arguments
		for (let i = 0; i < args.length; i++) {
			switch (args[i]) {
				case '--reset':
					await resetDB();
					break;
				case '--populateFake':
					await populateWithFakeData(Number(args[i + 1]));
					break;
			}
		}
		await mongoose.connection.close();
	} else if (args[0] == 'files') {
		args = args.slice(1);

		for (let i = 0; i < args.length; i++) {
			switch (args[i]) {
				case '--reset':
					await resetFiles();
					break;
			}
		}
	}
}

main();
