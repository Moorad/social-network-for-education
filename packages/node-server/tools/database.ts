import mongoose from 'mongoose';
import User from '../Models/User';
import { faker } from '@faker-js/faker';
import Post from '../Models/Post';
import Login from '../Models/Login';
import bcrypt from 'bcrypt';
import Comment from '../Models/Comment';
import Chat from '../Models/Chat';

import * as dotenv from 'dotenv';
dotenv.config({path: "../"});

export function connectToDB(dbName: string) {
	return new Promise<void>((resolve, reject) => {
		if (!process.env.DB) {
			reject('DB does not exist in environment variables');
		}

		mongoose.connect(process.env.DB + dbName).then(() => {
			console.log('Database successfully connected to ' + process.env.DB);
			resolve();
		});
	});
}

export async function resetDB() {
	await mongoose.connection.db.dropDatabase();
	await User.ensureIndexes();
	console.log('Database dropped and recreated.');

	const bobPassword = await bcrypt.hash('bob123', 10);

	// Create Bob
	const bobLogin = new Login({
		email: 'bob@mail.com',
		password: bobPassword,
		strategy: 'Local',
	});

	const bob = new User({
		displayName: 'Bob',
		description: "I'm Bob 😎. Nice to meet you 🤝",
		label: 'Hardcore Gamer',
		followerCount: 1,
		followingCount: 1,
		avatar: `${process.env.EXPRESS_URL}/resource/d741bf93-672a-4b04-83ad-fbb90009f211`,
	});

	bobLogin.userId = bob._id;
	bobLogin.save();

	const michealPassword = await bcrypt.hash('mike123', 10);

	const michealLogin = new Login({
		email: 'mike@mail.com',
		password: michealPassword,
		strategy: 'Local',
	});

	const micheal = new User({
		displayName: 'Micheal',
		description: "I'm Micheal, The 2nd test account.",
		label: 'First Year Undergrad',
		followerCount: 1,
		followingCount: 1,
		avatar: `${process.env.EXPRESS_URL}/resource/70bb12c5-5084-4f73-8302-451a2764e3e2`,
	});

	michealLogin.userId = micheal._id;
	michealLogin.save();

	bob.followers.push(micheal._id);
	bob.followings.push(micheal._id);

	micheal.followers.push(bob._id);
	micheal.followings.push(bob._id);

	const bobPost = new Post({
		title: 'Good moring everybody',
		description: 'Today is going to be a good day! 👊👊😎😎🧃🧃',
		posterId: bob._id,
		commentCount: 1,
	});

	bob.posts.push(bobPost._id);

	const mikeComment = new Comment({
		content: 'Nice post',
		postId: bobPost._id,
		userId: micheal._id,
	});

	mikeComment.parents = [mikeComment._id];

	await mikeComment.save();

	const mikePost = new Post({
		title: 'My first post',
		description: 'This is my first post on this thing.',
		posterId: micheal._id,
		commentCount: 1,
	});

	const bobComment = new Comment({
		content: 'You are so awesome man!!! 🏆🏆🏆',
		postId: mikePost._id,
		userId: bob._id,
	});

	bobComment.parents = [bobComment._id];

	await bobComment.save();

	micheal.posts.push(mikePost._id);

	await bobPost.save();
	await bob.save();
	console.log('Bob added to the database');

	await mikePost.save();
	await micheal.save();
	console.log('Micheal added to the database');

	const bobMikeChat = new Chat({
		type: 'direct',
		members: [bob._id, micheal._id],
	});
	await bobMikeChat.save();
	console.log('Bob <-> Mike chat added to the database');

	console.log('Database reset complete.');
}

export async function populateWithFakeData(userCount: number) {
	const users = [];
	const posts = [];

	const insertLogins = [];
	const insertUsers = [];
	const insertPosts = [];

	if (isNaN(userCount)) {
		console.log('Invalid populate user count.');
		return;
	}

	console.log(`populating database with ${userCount} fake users`);

	for (let i = 0; i < userCount; i++) {
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();

		insertUsers.push({
			_id: new mongoose.Types.ObjectId(),
			displayName: faker.name.fullName({
				firstName: firstName,
				lastName: lastName,
			}),
			description: faker.lorem.paragraph(),
			label: faker.name.jobTitle(),
			avatar: faker.image.image(512, 512, true),
			followerCount: Number(faker.datatype.bigInt({ max: userCount })),
			followingCount: faker.datatype.number({ max: userCount }),
			posts: [] as (string | mongoose.Types.ObjectId)[],
		});

		const password = await bcrypt.hash(faker.internet.password(), 10);

		const userReference = insertUsers[insertUsers.length - 1];

		insertLogins.push({
			_id: new mongoose.Types.ObjectId(),
			userId: userReference._id,
			email: faker.internet.email(firstName, lastName),
			password: password,
			strategy: 'Local',
		});

		const postCount = Math.floor(Math.random() * 5);

		for (let j = 0; j < postCount; j++) {
			insertPosts.push({
				_id: new mongoose.Types.ObjectId(),
				title: faker.lorem.sentence(),
				description: faker.lorem.paragraph(),
				posterId: userReference._id,
				created: faker.date.past(),
			});

			const postReference = insertPosts[insertPosts.length - 1];

			userReference.posts.push(postReference._id);
			posts.push(postReference._id);
		}

		users.push(userReference._id);
		console.log(`User ${userReference.displayName} was created`);
	}

	Login.insertMany(insertLogins);
	console.log(`Inserting ${insertLogins.length} logins to DB`);
	User.insertMany(insertUsers);
	console.log(`Inserting ${insertUsers.length} users to DB`);
	Post.insertMany(insertPosts);
	console.log(`Inserting ${insertPosts.length} posts to DB`);

	// Interactions
	for (let i = 0; i < posts.length; i++) {
		// Number of view, likes and comments
		const viewCount = Math.floor(Math.random() * users.length);
		const likeCount = Math.floor(Math.random() * viewCount);
		const commentCount = Math.floor(Math.random() * viewCount);

		// Generate random comments
		const peopleComments = faker.helpers.arrayElements(users, commentCount);
		for (let j = 0; j < commentCount; j++) {
			const comment = new Comment({
				postId: posts[i],
				userId: peopleComments[j],
				content: faker.lorem.paragraph(),
				likeCount: faker.datatype.number({ max: viewCount }),
			});

			comment.likes = faker.helpers.arrayElements(
				users,
				comment.likeCount
			);
			comment.parents = [comment._id];

			await comment.save();
		}

		await Post.findByIdAndUpdate(posts[i], {
			likeCount: likeCount,
			viewCount: viewCount,
			commentCount: commentCount,
		}).exec();

		console.log(
			`Post ${posts[i]} was added with ${viewCount} views, ${likeCount} likes, ${commentCount} comments`
		);
	}
}
