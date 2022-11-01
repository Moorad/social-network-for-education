import { Schema, model } from 'mongoose';

interface IPost {
	title: string;
	description: string;
	posterId: Schema.Types.ObjectId;
	created: Date;
	likes: number;
}

const postSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	posterId: { type: Schema.Types.ObjectId, required: true },
	created: { type: Date, default: Date.now },
	likes: { type: Number, default: 0 },
});

postSchema.index({ title: 'text' });

const Post = model<IPost>('post', postSchema);

export default Post;
