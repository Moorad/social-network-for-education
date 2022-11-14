import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, z } from 'zod';

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
