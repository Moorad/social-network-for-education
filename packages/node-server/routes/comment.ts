import express, { Request, Response } from 'express';
import Comment from '../Models/Comment';
import Post from '../Models/Post';
import {
	CommentIDInQuery,
	CreateReplyComment,
	validate,
} from '../utils/validation';
import { authenticateToken } from './auth';
const router = express.Router();

router.get(
	'/like',
	[validate(CommentIDInQuery), authenticateToken],
	async (req: Request, res: Response) => {
		const commentId = req.query.commentId;

		try {
			const alreadyLiked = await Comment.findOne({
				_id: commentId,
				likes: res.locals.user.id,
			}).exec();

			if (!alreadyLiked) {
				await Comment.findByIdAndUpdate(commentId, {
					$inc: { likeCount: 1 },
					$push: { likes: res.locals.user.id },
				}).exec();
			} else {
				await Comment.findByIdAndUpdate(commentId, {
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

router.post(
	'/reply',
	[validate(CreateReplyComment), authenticateToken],
	async (req: Request, res: Response) => {
		try {
			const comment = await Comment.findById(req.query.commentId).exec();

			if (comment == null) {
				return res.sendStatus(404);
			}

			const reply = new Comment({
				userId: res.locals.user.id,
				postId: comment.postId,
				content: req.body.content,
				type: 'reply',
				commentId: req.query.commentId,
			});

			await reply.save();

			await Post.findByIdAndUpdate(comment.postId, {
				$inc: { commentCount: 1 },
			});

			return res.sendStatus(200);
		} catch (err) {
			return res.sendStatus(404);
		}
	}
);

export default router;
