import { model, Schema, Types } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { z } from 'zod';

export const LoginZod = z.object({
	userId: z.instanceof(Types.ObjectId),
	email: z.string().nullable(),
	password: z.string().nullable(),
	googleId: z.string().nullable(),
	facebookId: z.string().nullable(),
	strategy: z.enum(['Local', 'Google', 'Facebook']),
});

export type LoginType = z.infer<typeof LoginZod>;

const LoginSchema = new Schema<LoginType>({
	userId: { type: Schema.Types.ObjectId, required: true },
	email: { type: String, default: null, unique: true },
	password: { type: String, default: null },
	googleId: { type: String, default: null },
	facebookId: { type: String, default: null },
	strategy: {
		type: String,
		enum: ['Local', 'Google', 'Facebook'],
		required: true,
	},
});

LoginSchema.plugin(mongooseUniqueValidator);

const Login = model<LoginType>('login', LoginSchema);

export default Login;
