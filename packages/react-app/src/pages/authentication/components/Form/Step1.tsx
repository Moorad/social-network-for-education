import React, { FormEvent, useRef, useState } from 'react';
import ErrorPrompt from './ErrorPrompt';
import NavButtons from './NavButtons';

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
		console.log('API call here');

		// setIsFetching(true);
		if (displayNameRef.current && emailRef.current && passwordRef.current)
			fetch('http://localhost:4000/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					displayName: displayNameRef.current.value,
					email: emailRef.current.value,
					password: passwordRef.current.value,
				}),
			})
				.then((res) => {
					if (res.ok) {
						return res.json();
					}

					return Promise.reject(res);
				})
				.then((res) => {
					console.log(res);
					// setIsFetching(false);
					props.next();
				})
				.catch((res) => {
					res.json().then((json: any) => {
						setError(`${res.status}: ${json.message}`);
					});
				});
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
