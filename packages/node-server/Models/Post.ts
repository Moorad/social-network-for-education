import { Schema, model } from 'mongoose';
import { z } from 'zod';

export const CommentZod = z.object({
	_id: z.instanceof(Schema.Types.ObjectId),
	posterId: z.instanceof(Schema.Types.ObjectId),
	content: z
		.string({
			required_error: 'Content is required',
		})
		.min(1, 'Content must not be empty'),
	created: z.string(),
	likeCount: z.number(),
	likes: z.array(z.instanceof(Schema.Types.ObjectId)),
	// commentCount: z.number(),
	// comments: z.array(z.instanceof(Schema.Types.ObjectId))
});

export type commentType = z.infer<typeof CommentZod>;

export const PostZod = z.object({
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
	posterId: z.instanceof(Schema.Types.ObjectId),
	created: z.date(),
	likeCount: z.number(),
	likes: z.array(z.instanceof(Schema.Types.ObjectId)),
	commentCount: z.number(),
	comments: z.array(CommentZod),
});

export type postType = z.infer<typeof PostZod>;

const postSchema = new Schema<postType>({
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

const Post = model<postType>('post', postSchema);

export default Post;
