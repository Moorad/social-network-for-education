import { Schema, model, Types } from 'mongoose';
import { z } from 'zod';

export const PostZod = z.object({
	_id: z.string().or(z.instanceof(Types.ObjectId)),
	title: z
		.string({
			required_error: 'Title is required',
		})
		.min(1, 'Title must not be empty'),
	description: z
		.string({
			required_error: 'Description is required',
		})
		.min(1, 'Description must not be empty'),
	posterId: z.string().or(z.instanceof(Types.ObjectId)),
	created: z.date(),
	likeCount: z.number(),
	likes: z.array(z.string().or(z.instanceof(Types.ObjectId))),
	viewCount: z.number(),
	views: z.array(z.string().or(z.instanceof(Types.ObjectId))),
	commentCount: z.number(),
});

export type PostType = z.infer<typeof PostZod>;

const postSchema = new Schema<PostType>({
	title: { type: String, required: true },
	description: { type: String, required: true },
	posterId: { type: Schema.Types.ObjectId, required: true },
	created: { type: Date, default: Date.now },
	likeCount: { type: Number, default: 0 },
	likes: { type: [Schema.Types.ObjectId], default: [] },
	viewCount: { type: Number, default: 0 },
	views: { type: [Schema.Types.ObjectId], default: [] },
	commentCount: { type: Number, default: 0 },
});

postSchema.index({ title: 'text' });

const Post = model<PostType>('post', postSchema);

export default Post;
