import express, { Request, Response } from 'express';
import Comment from '../Models/Comment';
import { CommentIDInQuery, validate } from '../utils/validation';
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

export default router;
