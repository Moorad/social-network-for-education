import express from 'express';
import User from '../Models/User';
import { authenticateToken } from './auth';
const router = express.Router();

router.get('/search', authenticateToken, async (req, res) => {
	const term = req.query.term;

	try {
		if (typeof term === 'string') {
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
		}

		res.statusCode = 400;
		return res.json({
			message: 'invalid query type',
		});
	} catch (err) {
		res.json({
			results: [],
		});
	}
});

export default router;
