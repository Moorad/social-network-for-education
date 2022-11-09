import { IUserSafe } from 'common';
import express from 'express';
import Post from '../Models/Post';
import User from '../Models/User';
import { authenticateToken } from './auth';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
	let userId;

	if (req.query.id) {
		userId = req.query.id;
	} else {
		userId = res.locals.user.id;
	}

	try {
		const doc = await User.findById(userId).exec();

		if (doc) {
			const user: IUserSafe = {
				displayName: doc.displayName,
				description: doc.description,
				label: doc.label,
				followerCount: doc.followerCount,
				followingCount: doc.followingCount,
				posts: doc.posts,
				avatar: doc.avatar,
				_id: doc._id,
				isPrivate: doc.isPrivate,
			};
			return res.json(user);
		} else {
			return res.sendStatus(404);
		}
	} catch (err) {
		res.statusCode = 404;
		return res.json({
			message: 'User was not found',
		});
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
				likeCount: 1,
				comments: 1,
				_id: 1,
				likes: {
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

export default router;
