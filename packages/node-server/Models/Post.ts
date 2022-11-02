import { IPost } from 'common';
import { Schema, model } from 'mongoose';

const postSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	posterId: { type: Schema.Types.ObjectId, required: true },
	created: { type: Date, default: Date.now },
	likes: { type: Number, default: 0 },
	comments: { type: [Schema.Types.ObjectId], default: [] },
});

postSchema.index({ title: 'text' });

const Post = model<IPost>('post', postSchema);

export default Post;
