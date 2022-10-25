import React, { FormEvent, useRef, useState } from 'react';
import ErrorPrompt from '../ErrorPrompt';
import NavButtons from './NavButtons';
import axios from 'axios';

type propTypes = {
	next: () => void;
};

export default function Step1(props: propTypes) {
	const [error, setError] = useState('');
	// const [isFetching, setIsFetching] = useState(false);
	const displayNameRef = useRef<HTMLInputElement>(null);
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	function handleSubmission(e: FormEvent) {
		e.preventDefault();
		// setIsFetching(true);
		if (displayNameRef.current && emailRef.current && passwordRef.current) {
			axios
				.post(
					`${process.env.REACT_APP_API_URL}/api/auth/register`,
					{
						displayName: displayNameRef.current.value,
						email: emailRef.current.value.toLowerCase(),
						password: passwordRef.current.value,
					},
					{
						withCredentials: true,
					}
				)
				.then(() => {
					// setIsFetching(false);
					props.next();
				})
				.catch((res) => {
					setError(
						`${res.response.status}: ${res.response.data.message}`
					);
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
			<ErrorPrompt message={error} />
			<NavButtons hasSubmit />
		</form>
	);
}
