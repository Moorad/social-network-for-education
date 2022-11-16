import { Schema, model, Types } from 'mongoose';
import { z } from 'zod';

export const UserZod = z.object({
	_id: z.string().or(z.instanceof(Types.ObjectId)),
	displayName: z.string().min(1),
	description: z.string(),
	label: z.string().default('No label'),
	followerCount: z.number().default(0),
	followingCount: z.number().default(0),
	posts: z.array(z.string().or(z.instanceof(Types.ObjectId))),
	avatar: z.string().default('http://localhost:4000/resource/default'),
	background: z.string().default('http://localhost:4000/resource/default_bg'),
	isPrivate: z.boolean().default(false),
});

export type UserType = z.infer<typeof UserZod>;
export type UserMinimal = Pick<UserType, 'displayName' | '_id' | 'avatar'>;

const userSchema = new Schema<UserType>({
	displayName: { type: String, required: true },
	description: { type: String, default: '' },
	label: { type: String, default: 'No label' },
	followerCount: { type: Number, default: 0 },
	followingCount: { type: Number, default: 0 },
	posts: { type: [Schema.Types.ObjectId], default: [] },
	avatar: {
		type: String,
		default: 'http://localhost:4000/resource/default',
	},
	background: {
		type: String,
		default: 'http://localhost:4000/resource/default_bg',
	},
	isPrivate: { type: Boolean, default: false },
});
userSchema.index({ displayName: 'text' });

const User = model<UserType>('user', userSchema);

export default User;
