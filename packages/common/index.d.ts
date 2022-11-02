export interface IPost {
	title: string;
	description: string;
	posterId: string;
	created: Date;
	likes: number;
	comments: Schema.Types.ObjectId[];
}

interface IUser {
	displayName: string;
	email: string;
	password: string;
	description: string;
	label: string;
	followerCount: number;
	followingCount: number;
	posts: Schema.Types.ObjectId[];
	avatar: string;
	_id: Schema.Types.ObjectId;
}

export type IUserSafe = Omit<IUser, 'email' | 'password'>;

export type IUserMinimal = Pick<IUser, 'displayName' | 'avatar' | '_id'>;
