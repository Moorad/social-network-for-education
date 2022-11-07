import mongoose from 'mongoose';
import app from './index';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
mongoose.connect(process.env.DB! + process.env.DB_NAME!);

mongoose.connection.once('connected', () => {
	console.log('Database successfully connected to ' + process.env.DB);
});

app.listen(process.env.PORT || '4000', () => {
	console.log(`Server listening on port ${process.env.PORT || '4000'}`);
});
