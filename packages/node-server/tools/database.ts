import mongoose from 'mongoose';
import User from '../Models/User';
import { faker } from '@faker-js/faker';
import Post from '../Models/Post';
import Login from '../Models/Login';

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

	// Create Bob
	const bobLogin = new Login({
		email: 'bob@mail.com',
		password:
			'$2b$10$uo2iiQ7JrffJLoFUTljLGO64xhF3H8ZYLEPi0kniVdLDTps6UW1Iu',
		strategy: 'Local',
	});

	const bob = new User({
		displayName: 'Bob',
		description: "I'm Bob 😎. Nice to meet you 🤝",
		label: 'Hardcore Gamer',
		followerCount: 0,
		followingCount: 10,
		avatar: 'http://localhost:4000/resource/d741bf93-672a-4b04-83ad-fbb90009f211',
	});

	bobLogin.userId = bob._id;
	bobLogin.save();

	const michealLogin = new Login({
		email: 'mike@mail.com',
		password:
			'$2b$10$bSkwRCdAZztTji8RbYuEy.myMmcknv7TqEQ2aH8iiJ5dUt/yUIySO',
		strategy: 'Local',
	});

	const micheal = new User({
		displayName: 'Micheal',
		description: "I'm Micheal, The 2nd test account.",
		label: 'First Year Undergrad',
		followerCount: 209,
		followingCount: 3,
		avatar: 'http://localhost:4000/resource/70bb12c5-5084-4f73-8302-451a2764e3e2',
	});

	michealLogin.userId = micheal._id;
	michealLogin.save();

	const bobPost = new Post({
		title: 'Good moring everybody',
		description: 'Today is going to be a good day! 👊👊😎😎🧃🧃',
		posterId: bob._id,
		comments: [
			{
				content: 'Nice post',
				posterId: micheal._id,
			},
		],
		commentCount: 1,
	});

	bob.posts.push(bobPost._id);

	const mikePost = new Post({
		title: 'My first post',
		description: 'This is my first post on this thing.',
		posterId: micheal._id,
		comments: [
			{ content: 'You are so awesome man!!! 🏆🏆🏆', posterId: bob._id },
		],
		commentCount: 1,
	});

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

		const userLogin = new Login({
			email: faker.internet.email(firstName, lastName),
			password: faker.internet.password(),
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

	// Interactions (likes)
	for (let i = 0; i < allPosts.length; i++) {
		const peopleLiked = Math.floor(Math.random() * allPeople.length);

		for (let j = 0; j < peopleLiked; j++) {
			const randomUser =
				allPeople[Math.floor(Math.random() * allPeople.length)];
			await Post.findByIdAndUpdate(allPosts[i], {
				$push: { likes: randomUser },
				$inc: { likeCount: 1 },
			}).exec();
		}
		console.log(`The post ${allPosts[i]} was liked ${peopleLiked} times`);
	}
}
