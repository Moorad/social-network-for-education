import { model, Schema } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

interface Login extends Document {
	userId: Schema.Types.ObjectId;
	email: string;
	password: string;
	googleId: string;
	facebookId: string;
	strategy: 'Local' | 'Google' | 'Facebook';
}

const LoginSchema = new Schema<Login>({
	userId: { type: Schema.Types.ObjectId, required: true },
	email: { type: String, default: '', unique: true },
	password: { type: String, default: '' },
	googleId: { type: String, default: '' },
	facebookId: { type: String, default: '' },
	strategy: {
		type: String,
		enum: ['Local', 'Google', 'Facebook'],
		required: true,
	},
});
LoginSchema.plugin(mongooseUniqueValidator);

const Login = model<Login>('login', LoginSchema);

export default Login;
