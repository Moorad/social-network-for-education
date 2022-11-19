import express, { Request, Response } from 'express';
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
			const post = await Post.findById(postId).exec();

			if (post == null) {
				return res.sendStatus(404);
			}

			const comments = [];

			for (let i = 0; i < post.comments.length; i++) {
				const user = await User.findById(
					post.comments[i].posterId
				).exec();
				comments.push({
					data: post.comments[i],
					user: {
						_id: user?._id,
						displayName: user?.displayName,
						avatar: user?.avatar,
					},
				});
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
			const post = await Post.findOneAndUpdate(
				{ postId: req.query.postId },
				{
					$inc: { commentCount: 1 },
					$push: {
						comments: {
							posterId: res.locals.user.id,
							content: req.body.content,
						},
					},
				}
			).exec();

			if (post == null) {
				return res.sendStatus(404);
			}

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
