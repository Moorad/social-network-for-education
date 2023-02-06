import { model, Schema, Types } from 'mongoose';
import { z } from 'zod';

const MessageZod = z.object({
	sender: z.string().or(z.instanceof(Types.ObjectId)),
	message: z.string(),
	timestamp: z.date().or(z.string()),
});

const ChatZod = z.object({
	type: z.enum(['direct', 'group']),
	members: z.array(z.string().or(z.instanceof(Types.ObjectId))),
	owner: z.string().or(z.instanceof(Types.ObjectId)).nullable(),
	messages: z.array(MessageZod),
});

export type MessageType = z.infer<typeof MessageZod>;
export type ChatType = z.infer<typeof ChatZod>;

const MessageSchema = new Schema<MessageType>({
	sender: { type: Schema.Types.ObjectId },
	message: { type: String },
	timestamp: { type: Date, default: Date.now() },
});

const ChatSchema = new Schema<ChatType>({
	type: { type: String, enum: ['direct', 'group'] },
	members: { type: [Schema.Types.ObjectId], default: [] },
	owner: { type: Schema.Types.ObjectId, default: null },
	messages: { type: [MessageSchema], default: [] },
});

const Chat = model<ChatType>('chat', ChatSchema);

export default Chat;
