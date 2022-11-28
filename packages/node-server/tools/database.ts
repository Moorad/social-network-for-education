import mongoose from 'mongoose';
import User from '../Models/User';
import { faker } from '@faker-js/faker';
import Post from '../Models/Post';
import Login from '../Models/Login';
import bcrypt from 'bcrypt';
import Comment from '../Models/Comment';

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
		avatar: 'http://localhost:4000/resource/d741bf93-672a-4b04-83ad-fbb90009f211',
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
		avatar: 'http://localhost:4000/resource/70bb12c5-5084-4f73-8302-451a2764e3e2',
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

	console.log('Database reset complete.');
}

export async function populateWithFakeData(userCount: number) {
	const allPosts = [];
	const allPeople = [];

	if (isNaN(userCount)) {
		console.log('Invalid populate user count.');
		return;
	}

	console.log(`populating database with ${userCount} fake users`);

	for (let i = 0; i < userCount; i++) {
		const firstName = faker.name.firstName();
		const lastName = faker.name.lastName();

		const password = await bcrypt.hash(faker.internet.password(), 10);

		const userLogin = new Login({
			email: faker.internet.email(firstName, lastName),
			password: password,
			strategy: 'Local',
		});

		const user = new User({
			displayName: faker.name.fullName({
				firstName: firstName,
				lastName: lastName,
			}),
			description: faker.lorem.paragraph(),
			label: faker.name.jobTitle(),
			avatar: faker.image.image(undefined, undefined, true),
			followerCount: Number(faker.datatype.bigInt({ max: 2000 })),
			followingCount: faker.datatype.number({ max: 2000 }),
		});

		userLogin.userId = user._id;
		await userLogin.save();
		allPeople.push(user._id);

		const numOfPosts = Math.floor(Math.random() * 5);

		for (let j = 0; j < numOfPosts; j++) {
			const post = new Post({
				title: faker.lorem.sentence(),
				description: faker.lorem.paragraph(),
				posterId: user._id,
				created: faker.date.past(),
			});

			user.posts.push(post._id);
			allPosts.push(post._id);
			await post.save();
		}

		await user.save();

		console.log(`${i + 1} - ${user.displayName} added to DB`);
	}

	// Interactions
	for (let i = 0; i < allPosts.length; i++) {
		// Number of view, likes and comments
		const viewCount = Math.floor(Math.random() * allPeople.length);
		const likeCount = Math.floor(Math.random() * viewCount);
		const commentCount = Math.floor(Math.random() * viewCount);

		// Generate random comments
		const peopleComments = faker.helpers.arrayElements(
			allPeople,
			commentCount
		);
		for (let j = 0; j < commentCount; j++) {
			const comment = new Comment({
				postId: allPosts[i],
				userId: peopleComments[j],
				content: faker.lorem.paragraph(),
			});

			comment.parents = [comment._id];

			await comment.save();
		}

		await Post.findByIdAndUpdate(allPosts[i], {
			likeCount: likeCount,
			viewCount: viewCount,
			commentCount: commentCount,
		}).exec();

		console.log(`The post ${allPosts[i]} was viewed ${viewCount} times`);
		console.log(`The post ${allPosts[i]} was liked ${likeCount} times`);
		console.log(
			`The post ${allPosts[i]} was commented ${commentCount} times`
		);
	}
}
