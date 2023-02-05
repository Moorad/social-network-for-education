import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ChatIdInQuery, validate } from '../utils/validation';
import Chat from '../Models/Chat';
import User, { UserMinimal } from '../Models/User';
import { authenticateToken } from './auth';

const router = express.Router();

router.get('/contacts', authenticateToken, async (req, res) => {
	try {
		const contacts = await Chat.find({
			members: new mongoose.Types.ObjectId(res.locals.user.id),
		}).exec();

		if (contacts == null) {
			return res.json([]);
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
				chatId: c._id,
				type: c.type,
				user: users.find((u) => c.members.includes(u._id)),
				lastMessage:
					c.messages.length > 0
						? c.messages[c.messages.length - 1]
						: null,
			}))
		);
	} catch {
		return res.sendStatus(400);
	}
});

router.get(
	'/messages',
	[validate(ChatIdInQuery), authenticateToken],
	async (req: Request, res: Response) => {
		try {
			const chat = await Chat.findById(req.query.chatId).exec();

			if (chat == null) {
				return res.sendStatus(404);
			}

			return res.json(chat.messages);
		} catch {
			return res.sendStatus(404);
		}
	}
);

export const socketMessageReceived = (payload: string) => {
	console.log(payload);
};

export default router;
