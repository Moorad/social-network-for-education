import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Comment from '../Models/Comment';
import Post from '../Models/Post';
import User, { UserMinimal } from '../Models/User';
import {
	CreateComment,
	CreatePost,
	ObjectIDInQuery,
	PostIDInQuery,
	validate,
} from '../utils/validation';
import { authenticateToken } from './auth';
const router = express.Router();

router.get(
	'/',
	[validate(ObjectIDInQuery), authenticateToken],
	async (req: Request, res: Response) => {
		try {
			const post = await Post.findById(req.query.id).exec();

			if (post == null) {
				return res.sendStatus(404);
			}

			const userInDB = await User.findById(post.posterId).exec();

			if (userInDB == null) {
				return res.sendStatus(404);
			}

			const user: UserMinimal = {
				displayName: userInDB.displayName,
				avatar: userInDB.avatar,
				_id: userInDB._id,
			};

			return res.json({
				post: post,
				user: user,
			});
		} catch (err) {
			return res.sendStatus(404);
		}
	}
);

router.post(
	'/',
	[validate(CreatePost), authenticateToken],
	async (req: Request, res: Response) => {
		const post = new Post({
			title: req.body.title,
			description: req.body.description,
			posterId: res.locals.user.id,
			attachments: req.body.attachments,
			tags: req.body.tags,
		});

		await post.save();

		await User.findByIdAndUpdate(res.locals.user.id, {
			$push: { posts: post._id },
		}).exec();

		res.sendStatus(200);
	}
);

router.get(
	'/like',
	[validate(PostIDInQuery), authenticateToken],
	async (req: Request, res: Response) => {
		const postId = req.query.postId;

		try {
			const alreadyLiked = await Post.findOne({
				_id: postId,
				likes: res.locals.user.id,
			}).exec();

			if (!alreadyLiked) {
				await Post.findByIdAndUpdate(postId, {
					$inc: { likeCount: 1 },
					$push: { likes: res.locals.user.id },
				}).exec();
			} else {
				await Post.findByIdAndUpdate(postId, {
					$inc: { likeCount: -1 },
					$pull: { likes: res.locals.user.id },
				}).exec();
			}

			res.sendStatus(200);
		} catch (err) {
			res.sendStatus(404);
		}
	}
);

router.get(
	'/comments',
	[validate(PostIDInQuery), authenticateToken],
	async (req: Request, res: Response) => {
		const postId = req.query.postId;

		try {
			const comments = await Comment.aggregate([
				{
					$match: {
						postId: new mongoose.Types.ObjectId(postId as string),
					},
				},
				{
					$lookup: {
						from: 'users',
						localField: 'userId',
						foreignField: '_id',
						pipeline: [
							{ $project: { _id: 1, displayName: 1, avatar: 1 } },
						],
						as: 'user',
					},
				},
				{ $unwind: '$user' },
				{ $sort: { created: -1 } },
			]).exec();

			if (comments == null) {
				return res.sendStatus(404);
			}

			res.json({
				comments: comments,
			});
		} catch (err) {
			return res.sendStatus(404);
		}
	}
);

router.post(
	'/comment',
	[validate(CreateComment), authenticateToken],
	async (req: Request, res: Response) => {
		try {
			const post = await Post.findByIdAndUpdate(req.query.postId, {
				$inc: { commentCount: 1 },
			}).exec();

			if (post == null) {
				return res.sendStatus(404);
			}

			const comment = new Comment({
				userId: res.locals.user.id,
				postId: req.query.postId,
				content: req.body.content,
			});

			comment.parents = [comment._id];

			await comment.save();

			return res.sendStatus(200);
		} catch (err) {
			return res.sendStatus(404);
		}
	}
);

router.get(
	'/view',
	[validate(PostIDInQuery), authenticateToken],
	async (req: Request, res: Response) => {
		const postId = req.query.postId;

		try {
			const alreadyViewed = await Post.findOne({
				_id: postId,
				views: res.locals.user.id,
			}).exec();

			if (alreadyViewed) {
				return res.sendStatus(202);
			}

			await Post.findByIdAndUpdate(postId, {
				$inc: { viewCount: 1 },
				$push: { views: res.locals.user.id },
			}).exec();

			res.sendStatus(200);
		} catch (err) {
			console.log(err);
			res.sendStatus(404);
		}
	}
);

export default router;
