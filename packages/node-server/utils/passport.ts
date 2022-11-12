import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import Login from '../Models/Login';
import User from '../Models/User';

const LocalStrategy = passportLocal.Strategy;
const SALT_ROUNDS = 10;

export const loginLocalStrategy = new LocalStrategy(
	{ usernameField: 'email' },
	async (email, password, done) => {
		try {
			const login = await Login.findOne({
				email: email.toLowerCase(),
			}).exec();

			if (login == null) {
				done(undefined, false, {
					message: 'Invalid email or password',
				});
				return;
			}

			if (login.password != undefined) {
				const match = await bcrypt.compare(password, login.password);

				if (!match) {
					done(undefined, false, {
						message: 'Invalid email or password',
					});
					return;
				}

				done(null, login);
			}
		} catch (err) {
			done(err);
			return;
		}
	}
);

export const registerLocalStrategy = new LocalStrategy(
	{ usernameField: 'email' },
	async (email, password, done) => {
		try {
			const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
			const user = new User();

			const login = new Login({
				email: email,
				password: hashedPassword,
				strategy: 'Local',
			});

			login.userId = user._id;
			return done(null, {
				login: login,
				user: user,
			});
		} catch (err) {
			return done(err);
		}
	}
);
