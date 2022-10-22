import { Schema, model } from 'mongoose';

interface IUser {
	displayName: string;
	email: string;
	password: string;
	description: string;
	label: string;
	followerCount: number;
	followingCount: number;
	posts: Schema.Types.ObjectId[];
	avatar: string;
}

export type IUserSafe = Omit<IUser, 'email' | 'password'>;

const userSchema = new Schema({
	displayName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	description: { type: String, default: '' },
	label: { type: String, default: 'No label' },
	followerCount: { type: Number, default: 0 },
	followingCount: { type: Number, default: 0 },
	posts: [Schema.Types.ObjectId],
	avatar: {
		type: String,
		default: 'http://localhost:4000/api/image/default',
	},
});

const User = model<IUser>('user', userSchema);

export default User;
