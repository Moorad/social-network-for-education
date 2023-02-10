import { Schema, model, Types } from 'mongoose';
import { z } from 'zod';

const NotificationZod = z.object({
	type: z.enum(['Message', 'Friend Request']),
	text: z.string(),
	user: z.string().or(z.instanceof(Types.ObjectId)),
});

export const UserZod = z.object({
	_id: z.string().or(z.instanceof(Types.ObjectId)),
	displayName: z.string().min(1),
	description: z.string(),
	label: z.string().default('No label'),
	followerCount: z.number().default(0),
	followers: z.array(z.string().or(z.instanceof(Types.ObjectId))),
	followingCount: z.number().default(0),
	followings: z.array(z.string().or(z.instanceof(Types.ObjectId))),
	posts: z.array(z.string().or(z.instanceof(Types.ObjectId))),
	avatar: z.string().default('http://localhost:4000/resource/default'),
	background: z.string().default('http://localhost:4000/resource/default_bg'),
	isPrivate: z.boolean().default(false),
	notifications: z.array(NotificationZod),
});

export type UserType = z.infer<typeof UserZod>;
export type UserMinimal = Pick<UserType, 'displayName' | '_id' | 'avatar'>;
export type NotificationType = z.infer<typeof NotificationZod>;

const notificationSchema = new Schema({
	type: { type: String, enum: ['Message', 'Friend Request'] },
	text: { type: String },
	user: { type: Types.ObjectId },
});

const userSchema = new Schema<UserType>({
	displayName: { type: String, required: true },
	description: { type: String, default: '' },
	label: { type: String, default: 'No label' },
	followerCount: { type: Number, default: 0 },
	followers: { type: [Schema.Types.ObjectId], default: [] },
	followingCount: { type: Number, default: 0 },
	followings: { type: [Schema.Types.ObjectId], default: [] },
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
	notifications: { type: [notificationSchema], default: [] },
});
userSchema.index({ displayName: 'text' });

const User = model<UserType>('user', userSchema);

export default User;
