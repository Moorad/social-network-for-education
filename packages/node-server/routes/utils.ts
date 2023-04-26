import express, { Request, Response } from 'express';
import User from '../Models/User';
import { SearchTerm, validate } from '../utils/validation';
import { authenticateToken } from './auth';
import axios from 'axios';
import Post from '../Models/Post';
import Chat from '../Models/Chat';
const router = express.Router();

export type ReferenceType = {
	title: string;
	DOI: string;
	creation: string;
	authors: string[];
};

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

router.get(
	'/search_reference',
	[validate(SearchTerm), authenticateToken],
	async (req: Request, res: Response) => {
		let term = req.query.term || '-';

		if (typeof term !== 'string') {
			return res.sendStatus(400);
		}

		term = term.replace('https://doi.org/', ''); // Improves search accuracy

		const filteredReponse: ReferenceType[] = [];

		let items;
		try {
			const DOIResponse = await axios.get(
				`http://api.crossref.org/works/${term}`
			);

			items = [DOIResponse.data.message];
		} catch {
			const QueryResponse = await axios.get(
				`http://api.crossref.org/works?query=${term}&rows=5`
			);

			items = QueryResponse.data.message.items;
		}

		for (let i = 0; i < items.length; i++) {
			let authors = [];
			let title = '';

			if (items[i].author) {
				authors = items[i].author.map(
					(author: any) => author.given + ' ' + author.family
				);
			}

			if (items[i].title) {
				title = items[i].title[0];
			} else if (items[i]['container-title']) {
				title = items[i]['container-title'][0];
			}

			filteredReponse.push({
				title: title,
				DOI: items[i].DOI,
				creation: items[i].created['date-time'],
				authors: authors,
			});
		}

		return res.json({ items: filteredReponse });
	}
);

router.get('/clear_notifications', authenticateToken, async (req, res) => {
	try {
		await User.updateOne(
			{ _id: res.locals.user.id },
			{
				notifications: [],
			}
		).exec();

		return res.sendStatus(200);
	} catch {
		return res.sendStatus(404);
	}
});

router.get('/stats', async (req, res) => {
	try {
		const stats = {
			userCount: 0,
			postCount: 0,
			messageCount: 0,
		};

		const userCount = await User.countDocuments().exec();

		if (userCount != null) {
			stats.userCount = userCount;
		}

		const postCount = await Post.countDocuments().exec();

		if (postCount != null) {
			stats.postCount = postCount;
		}

		const messageCount = await Chat.aggregate([
			{ $unwind: '$messages' },
			{ $group: { _id: '$_id', sum: { $sum: 1 } } },
			{ $group: { _id: null, sum: { $sum: '$sum' } } },
		]).exec();

		if (messageCount != null && messageCount.length > 0) {
			stats.messageCount = messageCount[0].sum;
		}

		return res.json(stats);
	} catch {
		return res.sendStatus(404);
	}
});

export default router;
