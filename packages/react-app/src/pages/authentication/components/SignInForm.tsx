import React, { FormEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	function handleSubmission(e: FormEvent) {
		e.preventDefault();
		if (emailRef.current && passwordRef.current) {
			fetch('http://localhost:4000/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: emailRef.current.value,
					password: passwordRef.current.value,
				}),
			})
				.then((res) => {
					if (!res.ok) {
						throw new Error(`${res.status} ${res.statusText}`);
					}

					return res.json();
				})
				.catch((err) => {
					console.log(err);
				})
				.then((res) => {
					console.log(res);
					navigate('/home');
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
					autoComplete='new-password'
					ref={passwordRef}
				/>
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
