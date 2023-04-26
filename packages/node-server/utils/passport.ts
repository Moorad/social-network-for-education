import passport from 'passport';
import passportLocal from 'passport-local';
import passportGoogle from 'passport-google-oauth20';
import passportFacebook from 'passport-facebook';
import bcrypt from 'bcrypt';
import Login from '../Models/Login';
import User from '../Models/User';

const LocalStrategy = passportLocal.Strategy;
const GoogleStrategy = passportGoogle.Strategy;
const FacebookStategy = passportFacebook.Strategy;
export const SALT_ROUNDS = 10;

passport.use(
	'login',
	new LocalStrategy(
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
					const match = await bcrypt.compare(
						password,
						login.password
					);

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
	)
);

passport.use(
	'register',
	new LocalStrategy(
		{ usernameField: 'email' },
		async (email, password, done) => {
			try {
				const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
				const user = new User();

				const login = new Login({
					userId: user._id,
					email: email,
					password: hashedPassword,
					strategy: 'Local',
				});

				return done(null, {
					login: login,
					user: user,
				});
			} catch (err) {
				return done(err);
			}
		}
	)
);

passport.use(
	'google',
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID || '',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
			callbackURL: `${process.env.REACT_URL}/auth/google/callback`,
			scope: ['profile'],
			passReqToCallback: true,
		},
		async (req, access, refresh, profile, done) => {
			try {
				const login = await Login.findOne({
					googleId: profile.id,
				}).exec();

				if (login == null) {
					const user = new User({
						displayName: profile.displayName,
					});
					const newLogin = new Login({
						userId: user._id,
						googleId: profile.id,
						strategy: 'Google',
					});

					await newLogin.save();
					await user.save();

					return done(null, newLogin.userId);
				} else {
					return done(null, login.userId);
				}
			} catch (err) {
				done('Something wrong happened');
			}
		}
	)
);

passport.use(
	'facebook',
	new FacebookStategy(
		{
			clientID: process.env.FACEBOOK_CLIENT_ID || '',
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
			callbackURL: `${process.env.REACT_URL}/auth/facebook/callback`,
		},
		async (access, refresh, profile, done) => {
			try {
				const login = await Login.findOne({
					facebookId: profile.id,
				}).exec();

				if (login == null) {
					const user = new User({
						displayName: profile.displayName,
					});

					const newLogin = new Login({
						userId: user._id,
						facebookId: profile.id,
						strategy: 'Facebook',
					});

					await newLogin.save();
					await user.save();

					return done(null, newLogin.userId);
				} else {
					return done(null, login.userId);
				}
			} catch (err) {
				done(err);
			}
		}
	)
);
