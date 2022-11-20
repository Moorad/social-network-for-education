import express, { Request, Response } from 'express';
import Post from '../Models/Post';
import User from '../Models/User';
import { UserIDInQuery, validate } from '../utils/validation';
import { authenticateToken } from './auth';

const router = express.Router();

router.get('/', authenticateToken, async (req: Request, res: Response) => {
	let userId;

	if (req.query.id) {
		userId = req.query.id;
	} else {
		userId = res.locals.user.id;
	}
	try {
		const user = await User.findOne(
			{ _id: userId },
			{
				_id: 1,
				displayName: 1,
				description: 1,
				label: 1,
				posts: 1,
				followerCount: 1,
				followingCount: 1,
				avatar: 1,
				background: 1,
				followers: {
					$elemMatch: { $eq: res.locals.user.id },
				},
				followings: {
					$elemMatch: { $eq: res.locals.user.id },
				},
			}
		).exec();

		if (user) {
			return res.json(user);
		}

		return res.sendStatus(404);
	} catch (err) {
		res.sendStatus(404);
	}
});

router.get('/posts', authenticateToken, async (req, res) => {
	let userId;

	if (req.query.id) {
		userId = req.query.id;
	} else {
		userId = res.locals.user.id;
	}

	try {
		const posts = await Post.find(
			{ posterId: userId },
			{
				title: 1,
				description: 1,
				posterId: 1,
				created: 1,
				_id: 1,
				viewCount: 1,
				likeCount: 1,
				commentCount: 1,
				likes: {
					$elemMatch: { $eq: res.locals.user.id },
				},
				views: {
					$elemMatch: { $eq: res.locals.user.id },
				},
			}
		).exec();

		if (posts == null) {
			return res.json({
				posts: [],
			});
		}

		const doc = await User.findById(userId).exec();

		if (doc) {
			const user = {
				displayName: doc.displayName,
				avatar: doc.avatar,
				_id: doc._id,
			};

			return res.json({
				posts: posts,
				user: user,
			});
		}

		return res.json({
			posts: posts,
		});
	} catch (err) {
		return res.sendStatus(404);
	}
});

router.get(
	'/follow',
	[validate(UserIDInQuery), authenticateToken],
	async (req: Request, res: Response) => {
		const userId = req.query.userId;

		try {
			const alreadyFollowed = await User.findOne({
				_id: userId,
				followers: res.locals.user.id,
			}).exec();

			if (!alreadyFollowed) {
				await User.findByIdAndUpdate(userId, {
					$inc: { followerCount: 1 },
					$push: { followers: res.locals.user.id },
				}).exec();

				await User.findByIdAndUpdate(res.locals.user.id, {
					$inc: { followingCount: 1 },
					$push: { followings: userId },
				});
			} else {
				await User.findByIdAndUpdate(userId, {
					$inc: { followerCount: -1 },
					$pull: { followers: res.locals.user.id },
				}).exec();

				await User.findByIdAndUpdate(res.locals.user.id, {
					$inc: { followingCount: -1 },
					$pull: { followings: userId },
				});
			}

			res.sendStatus(200);
		} catch (err) {
			res.sendStatus(404);
		}
	}
);

export default router;
