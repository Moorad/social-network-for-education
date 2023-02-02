import { Schema, model, Types } from 'mongoose';
import { z } from 'zod';

export const Attachment = z.object({
	name: z.string(),
	url: z.string(),
	mime: z.string(),
});

export const Reference = z.object({
	title: z.string(),
	DOI: z.string(),
	creation: z.string(),
	authors: z.array(z.string()),
});

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
	attachments: z.array(Attachment),
	tags: z.array(z.string()),
	references: z.array(Reference),
});

export type PostType = z.infer<typeof PostZod>;
type attachmentType = z.infer<typeof Attachment>;
type referenceType = z.infer<typeof Reference>;

const attachmentSchema = new Schema<attachmentType>({
	name: { type: String },
	url: { type: String },
	mime: { type: String },
});

const referenceSchema = new Schema<referenceType>({
	title: { type: String },
	DOI: { type: String },
	creation: { type: String },
	authors: { type: [String] },
});

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
	attachments: { type: [attachmentSchema], default: [] },
	tags: { type: [String], default: [] },
	references: { type: [referenceSchema], default: [] },
});

postSchema.index({ title: 'text' });

const Post = model<PostType>('post', postSchema);

export default Post;
