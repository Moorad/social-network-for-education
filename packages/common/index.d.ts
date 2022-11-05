export interface IPost {
	title: string;
	description: string;
	posterId: string;
	created: Date;
	likeCount: number;
	likes: Schema.Types.ObjectId[];
	comments: Schema.Types.ObjectId[];
	_id: Schema.Types.ObjectId;
}

export interface IUser {
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
	isPrivate: boolean;
}

export type IUserSafe = Omit<IUser, 'email' | 'password'>;

export type IUserMinimal = Pick<IUser, 'displayName' | 'avatar' | '_id'>;
