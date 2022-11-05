import { IUser } from 'common';
import { Schema, model } from 'mongoose';

const userSchema = new Schema({
	displayName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	description: { type: String, default: '' },
	label: { type: String, default: 'No label' },
	followerCount: { type: Number, default: 0 },
	followingCount: { type: Number, default: 0 },
	posts: { type: [Schema.Types.ObjectId], default: [] },
	avatar: {
		type: String,
		default: 'http://localhost:4000/resource/default',
	},
	isPrivate: { type: Boolean, default: false },
});
userSchema.index({ displayName: 'text' });

const User = model<IUser>('user', userSchema);

export default User;
