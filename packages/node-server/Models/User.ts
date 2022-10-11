import {Schema, model} from 'mongoose';

const userSchema = new Schema({
	displayName: String,
	email: String,
	password: String
});

const User = model('user', userSchema);

export default User;