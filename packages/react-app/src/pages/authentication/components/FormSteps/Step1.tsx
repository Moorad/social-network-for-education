import React, { FormEvent, useState } from 'react';
import NavButtons from './NavButtons';

type propTypes = {
	next: () => void;
};

export default function Step1(props: propTypes) {
	const [isFetching, setIsFetching] = useState(false);
	const [displayName, setDisplayName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function handleSubmission(e: FormEvent) {
		e.preventDefault();
		console.log('API call here');

		setIsFetching(true);

		fetch('http://localhost:4000/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				displayName: displayName,
				email: email,
				password: password,
			}),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`${res.status} ${res.statusText}`);
				}

				return res.json();
			})
			// .catch((err) => {
			// 	setError(err.name + ': ' + err.message);
			// })
			.then((res) => {
				console.log(res);
				setIsFetching(false);
				props.next();
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
				onChange={(e) => setDisplayName(e.target.value)}
				autoComplete='nickname'
			/>
			<input
				placeholder='Email address'
				type='email'
				className='border border-gray-300 rounded w-full px-4 py-1'
				required
				onChange={(e) => setEmail(e.target.value)}
				autoComplete='email'
			/>
			<input
				placeholder='Password'
				type='password'
				className='border border-gray-300 rounded w-full px-4 py-1'
				required
				onChange={(e) => setPassword(e.target.value)}
				autoComplete='new-password'
			/>
			<NavButtons hasSubmit />
		</form>
	);
}
