import { Schema, model, Types } from 'mongoose';
import { z } from 'zod';

export const CommentZod = z.object({
	_id: z.string().or(z.instanceof(Types.ObjectId)),
	posterId: z.string().or(z.instanceof(Types.ObjectId)),
	content: z
		.string({
			required_error: 'Content is required',
		})
		.min(1, 'Content must not be empty'),
	created: z.string(),
	likeCount: z.number(),
	likes: z.array(z.string().or(z.instanceof(Types.ObjectId))),
	// commentCount: z.number(),
	// comments: z.array(z.instanceof(Types.ObjectId))
});

export type CommentType = z.infer<typeof CommentZod>;

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
	commentCount: z.number(),
	comments: z.array(CommentZod),
});

export type PostType = z.infer<typeof PostZod>;

const postSchema = new Schema<PostType>({
	title: { type: String, required: true },
	description: { type: String, required: true },
	posterId: { type: Schema.Types.ObjectId, required: true },
	created: { type: Date, default: Date.now },
	likeCount: { type: Number, default: 0 },
	likes: { type: [Schema.Types.ObjectId], default: [] },
	commentCount: { type: Number, default: 0 },
	comments: {
		type: [
			{
				posterId: Schema.Types.ObjectId,
				content: String,
				created: { type: Date, default: Date.now },
				likes: { type: [Schema.Types.ObjectId], default: [] },
				likeCount: { type: Number, default: 0 },
			},
		],
		default: [],
	},
});

postSchema.index({ title: 'text' });

const Post = model<PostType>('post', postSchema);

export default Post;
