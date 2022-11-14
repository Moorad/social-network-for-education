import express, { Request, Response } from 'express';
import User from '../Models/User';
import { SearchTerm, validate } from '../utils/validation';
import { authenticateToken } from './auth';
const router = express.Router();

router.get(
	'/search',
	[validate(SearchTerm), authenticateToken],
	async (req: Request, res: Response) => {
		const term = req.query.term;

		if (typeof term !== 'string') {
			return res.sendStatus(400);
		}

		try {
			const docs = await User.find({
				$text: {
					$search: term,
				},
			})
				.limit(5)
				.exec();

			const users = [];
			if (docs) {
				for (let i = 0; i < docs.length; i++) {
					users.push({
						displayName: docs[i].displayName,
						_id: docs[i]._id,
						avatar: docs[i].avatar,
					});
				}
			}

			return res.json({
				results: users,
			});
		} catch (err) {
			res.json({
				results: [],
			});
		}
	}
);

export default router;
