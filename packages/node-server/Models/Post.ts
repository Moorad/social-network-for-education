import { IPost } from 'common';
import { Schema, model } from 'mongoose';

const postSchema = new Schema({
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

const Post = model<IPost>('post', postSchema);

export default Post;
