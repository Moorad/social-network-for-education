import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { AnyZodObject, z } from 'zod';
import { CommentZod, PostZod } from '../Models/Post';

export const LocalRegister = z.object({
	body: z.object({
		displayName: z
			.string({
				required_error: 'Display name is required',
			})
			.min(1, 'Display name must not be empty'),
		email: z
			.string({ required_error: 'Email is required' })
			.email({ message: 'Invalid email' }),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters long'),
	}),
});

export const LocalLogin = z.object({
	body: z.object({
		email: z
			.string({ required_error: 'Email is required' })
			.min(1, 'Email must not be empty'),
		password: z
			.string({ required_error: 'Password is required' })
			.min(1, 'Password must not be empty'),
	}),
});

export const SearchTerm = z.object({
	query: z.object({
		term: z.string({
			required_error: 'Term query is required',
		}),
	}),
});

export const ObjectIDInQuery = z.object({
	query: z.object({
		id: z
			.string({
				required_error: 'ID is required',
			})
			.refine((id) => isValidObjectId(id), 'Object ID is not valid'),
	}),
});

export const PostIDInQuery = z.object({
	query: z.object({
		postId: z
			.string({
				required_error: 'Post ID is required',
			})
			.refine((id) => isValidObjectId(id), 'Object ID is not valid'),
	}),
});

export const UserIDInQuery = z.object({
	query: z.object({
		userId: z
			.string({
				required_error: 'User ID is required',
			})
			.refine((id) => isValidObjectId(id), 'Object ID is not valid'),
	}),
});

export const CreateComment = z.object({
	body: CommentZod.pick({ content: true }),
	query: z.object({
		postId: z
			.string({
				required_error: 'Post ID is required',
			})
			.refine((id) => isValidObjectId(id), 'Object ID is not valid'),
	}),
});

export const CreatePost = z.object({
	body: PostZod.pick({ title: true, description: true }),
});

export const FeedType = z.object({
	query: z.object({
		type: z.enum(['following', 'explore']),
		skip: z.string().optional(),
		limit: z.string().optional(),
	}),
});

export const uploadFile = z.object({
	query: z.object({
		for: z.enum(['Avatar', 'Profile_Background']),
	}),
});

// Validation middleware
/* eslint-disable indent */
export const validate =
	(schema: AnyZodObject) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});

			return next();
		} catch (err) {
			return res.status(400).json(err);
		}
	};
/* eslint-enable indent */
