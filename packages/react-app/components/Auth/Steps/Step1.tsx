import React, { FormEvent, useRef } from 'react';
import NavButtons from './NavButtons';
import { useMutation } from 'react-query';
import { registerUser } from '../../../api/authApi';
import toast from 'react-hot-toast';

type propTypes = {
	next: () => void;
};

export default function Step1(props: propTypes) {
	const displayNameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const registerMutation = useMutation('register', registerUser, {
		onSuccess: () => {
			props.next();
		},
		onError: (error) => {
			const err = error as any;
			switch (err.response.status) {
				case (400):
					toast.error(`Invalid input: ${err.response.data.issues[0].message}`);
					break;
				case (409):
					toast.error('The email is already in use');
					break;
				default:
					toast.error('The server has encountered an internal error, please try again later');
			}
		}
	});

	function handleSubmission(e: FormEvent) {
		e.preventDefault();

		if (displayNameRef.current && emailRef.current && passwordRef.current) {
			registerMutation.mutate({
				displayName: displayNameRef.current.value,
				email: emailRef.current.value.toLowerCase(),
				password: passwordRef.current.value,
			});
		}
	}
	return (
		<form
			onSubmit={(e) => handleSubmission(e)}
			className='flex flex-col gap-5'
		>
			<input
				placeholder='Display Name'
				type='text'
				className='border border-gray-300 rounded w-full px-4 py-1'
				required
				ref={displayNameRef}
				autoComplete='nickname'
			/>
			<input
				placeholder='Email address'
				type='email'
				className='border border-gray-300 rounded w-full px-4 py-1'
				required
				ref={emailRef}
				autoComplete='email'
			/>
			<input
				placeholder='Password'
				type='password'
				className='border border-gray-300 rounded w-full px-4 py-1'
				required
				ref={passwordRef}
				autoComplete='new-password'
			/>
			<NavButtons hasSubmit />
		</form>
	);
}
