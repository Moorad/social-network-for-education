import { model, Schema, Types } from 'mongoose';
import { z, ZodType } from 'zod';

type ReplyCommentType = {
	_id: string | Types.ObjectId;
	userId: string | Types.ObjectId;
	content: string;
	created: Date;
	likeCount: number;
	likes: (string | Types.ObjectId)[];
	replies: ReplyCommentType[];
};

export const ReplyCommentZod: ZodType<ReplyCommentType> = z.lazy(() =>
	z.object({
		_id: z.string().or(z.instanceof(Types.ObjectId)),
		userId: z.string().or(z.instanceof(Types.ObjectId)),
		content: z
			.string({
				required_error: 'Content is required',
			})
			.min(1, 'Content must not be empty'),
		created: z.date(),
		likeCount: z.number(),
		likes: z.array(z.string().or(z.instanceof(Types.ObjectId))),
		replies: z.array(ReplyCommentZod),
	})
);

const replyCommentSchema = new Schema<ReplyCommentType>({
	userId: { type: Schema.Types.ObjectId },
	content: { type: String },
	created: { type: Date, default: Date.now },
	likes: { type: [Schema.Types.ObjectId], default: [] },
	likeCount: { type: Number, default: 0 },
});

replyCommentSchema.add({
	replies: { type: [replyCommentSchema], default: [] },
});

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
	replies: z.array(ReplyCommentZod),
});

export type CommentType = z.infer<typeof CommentZod>;

const commentSchema = new Schema<CommentType>({
	userId: { type: Schema.Types.ObjectId },
	postId: { type: Schema.Types.ObjectId },
	content: { type: String },
	created: { type: Date, default: Date.now },
	likes: { type: [Schema.Types.ObjectId], default: [] },
	likeCount: { type: Number, default: 0 },
	replies: { type: [replyCommentSchema], default: [] },
});

const Comment = model<CommentType>('comment', commentSchema);

export default Comment;
