import express from 'express';
import mongoose from 'mongoose';
import Chat from '../Models/Chat';
import User, { UserMinimal } from '../Models/User';
import { authenticateToken } from './auth';

const router = express.Router();

router.get('/contacts', authenticateToken, async (req, res) => {
	const contacts = await Chat.find({
		members: new mongoose.Types.ObjectId(res.locals.user.id),
	}).exec();

	if (contacts == null) {
		return res.json({
			contacts: [],
			users: [],
		});
	}

	const users: UserMinimal[] = [];
	for (const contact of contacts) {
		const otherUser = contact.members.filter(
			(user) => user != res.locals.user.id
		)[0];

		const userInfo = await User.findById(otherUser).exec();

		if (userInfo == null) {
			return;
		}

		users.push({
			displayName: userInfo.displayName,
			avatar: userInfo.avatar,
			_id: userInfo._id,
		});
	}

	return res.json(
		contacts.map((c) => ({
			type: c.type,
			user: users.find((u) => c.members.includes(u._id)),
			lastMessage:
				c.messages.length > 0
					? c.messages[c.messages.length - 1]
					: null,
		}))
	);
});

export default router;
