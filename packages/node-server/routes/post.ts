import { IUserMinimal } from 'common';
import express from 'express';
import Post from '../Models/Post';
import User from '../Models/User';
import { authenticateToken } from './auth';
const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
	if (!req.query.id) {
		return res.sendStatus(400);
	}

	try {
		const post = await Post.findById(req.query.id).exec();

		if (post == null) {
			return res.sendStatus(404);
		}

		const userInDB = await User.findById(post.posterId).exec();

		if (userInDB == null) {
			return res.sendStatus(404);
		}

		const user: IUserMinimal = {
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
});

router.post('/', authenticateToken, async (req, res) => {
	if (!req.body.title || !req.body.description) {
		return res.sendStatus(400);
	}

	const post = new Post({
		title: req.body.title,
		description: req.body.description,
		posterId: res.locals.user.id,
	});

	await post.save();

	await User.findByIdAndUpdate(res.locals.user.id, {
		$push: { posts: post._id },
	}).exec();

	res.json({
		message: 'ok',
	});
});

router.get('/like', authenticateToken, async (req, res) => {
	const postId = req.query.postId;

	const alreadyLiked = await Post.findOne({
		_id: postId,
		likes: res.locals.user.id,
	});

	if (!alreadyLiked) {
		await Post.findByIdAndUpdate(postId, {
			$inc: { likeCount: 1 },
			$push: { likes: res.locals.user.id },
		});
	} else {
		await Post.findByIdAndUpdate(postId, {
			$inc: { likeCount: -1 },
			$pull: { likes: res.locals.user.id },
		});
	}

	res.json({
		message: 'ok',
	});
});

router.get('/comments', authenticateToken, async (req, res) => {
	const postId = req.query.postId;

	if (!postId) {
		return res.sendStatus(400);
	}

	try {
		const post = await Post.findById(postId).exec();

		if (post == null) {
			return res.sendStatus(404);
		}

		const comments = [];

		for (let i = 0; i < post.comments.length; i++) {
			const user = await User.findById(post.comments[i].posterId).exec();
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
});

export default router;
