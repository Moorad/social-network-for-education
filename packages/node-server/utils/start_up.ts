export function startUpCheck() {
	if (!process.env.DB) {
		throw 'Database URI (DB) is not configured in environment variables';
	}

	if (!process.env.DB_NAME) {
		throw 'Database name (DB_NAME) is not configured in environment variables';
	}

	if (!process.env.DB_NAME) {
		throw 'JWT secret key (SECRET_TOKEN) is not configured in environment variables. Please generate a 64 character random string and set that as your SECRET_TOKEN';
	}
}
