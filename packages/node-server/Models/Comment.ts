import { model, Schema, Types } from 'mongoose';
import { z } from 'zod';

export const CommentZod = z.object({
	_id: z.string().or(z.instanceof(Types.ObjectId)),
	userId: z.string().or(z.instanceof(Types.ObjectId)),
	postId: z.string().or(z.instanceof(Types.ObjectId)),
	content: z
		.string({
			required_error: 'Content is required',
		})
		.min(1, 'Content must not be empty'),
	created: z.date(),
	likeCount: z.number(),
	likes: z.array(z.string().or(z.instanceof(Types.ObjectId))),
	type: z.enum(['post', 'reply']),
	commentId: z.string().or(z.instanceof(Types.ObjectId)).nullable(),
});

export type CommentType = z.infer<typeof CommentZod>;

const commentSchema = new Schema<CommentType>({
	userId: { type: Schema.Types.ObjectId },
	postId: { type: Schema.Types.ObjectId },
	content: { type: String },
	created: { type: Date, default: Date.now },
	likes: { type: [Schema.Types.ObjectId], default: [] },
	likeCount: { type: Number, default: 0 },
	type: { type: String, default: 'post' },
	commentId: { type: Schema.Types.ObjectId, default: null },
});

const Comment = model<CommentType>('comment', commentSchema);

export default Comment;
