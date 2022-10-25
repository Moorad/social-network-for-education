import React, { FormEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorPrompt from './ErrorPrompt';
import axios from 'axios';

export default function SignIn() {
	const [error, setError] = useState('');
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	function handleSubmission(e: FormEvent) {
		e.preventDefault();
		setError('');
		if (emailRef.current && passwordRef.current) {
			axios
				.post(
					`${process.env.REACT_APP_API_URL}/api/auth/login`,
					{
						email: emailRef.current.value.toLowerCase(),
						password: passwordRef.current.value,
					},
					{
						withCredentials: true,
					}
				)
				.then(() => {
					navigate('/home');
				})
				.catch((res) => {
					setError(
						`${res.response.status}: ${res.response.data.message}`
					);
				});
		}
	}

	return (
		<div className='relative w-fit h-fit bg-gray-50 px-10 py-16 rounded-lg align-middle border-gray-300 border max-w-md'>
			<div className='text-center pb-16 text-black'>
				<div className='text-3xl font-bold py-3'>Login</div>
				<div className='text-gray-600 text-lg'>
					Welcome back! Fill in your email and password
				</div>
			</div>
			<form
				className='flex flex-col gap-5'
				onSubmit={(e) => handleSubmission(e)}
			>
				<input
					placeholder='Email address'
					type='email'
					className='border border-gray-300 rounded w-full px-4 py-1'
					required
					autoComplete='email'
					ref={emailRef}
				/>
				<input
					placeholder='Password'
					type='password'
					className='border border-gray-300 rounded w-full px-4 py-1'
					required
					autoComplete='current-password'
					ref={passwordRef}
				/>
				<ErrorPrompt message={error} />
				<div className='flex justify-end text-sm gap-3 text-white mt-14'>
					<button
						type='submit'
						className='bg-blue-500 py-2 px-6 rounded'
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
