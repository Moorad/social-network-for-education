import express from 'express';
import Post from '../Models/Post';
import User from '../Models/User';
import { authenticateToken } from './auth';
const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
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

export default router;
