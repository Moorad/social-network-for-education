import React, { FormEvent, useRef, useState } from 'react';
import ErrorPrompt from './ErrorPrompt';
import axios from 'axios';
import router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';

export default function SignIn() {
	const [error, setError] = useState('');
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	function handleSubmission(e: FormEvent) {
		e.preventDefault();
		setError('');
		if (emailRef.current && passwordRef.current) {
			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
					{
						email: emailRef.current.value.toLowerCase(),
						password: passwordRef.current.value,
					},
					{
						withCredentials: true,
					}
				)
				.then(() => {
					router.push('/home');
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
				<div className='flex justify-end text-sm gap-3 text-white mt-4'>
					<button
						type='submit'
						className='bg-blue-500 py-2 px-6 rounded'
					>
						Submit
					</button>
				</div>
				<div className='flex flex-col gap-6 mt-2'>
					{/* This is the divider */}
					<div className='relative flex items-center'>
						<div className='flex-grow border-gray-300 border-t'></div>
						<span className='flex-shrink mx-4 text-gray-500 text-sm'>
							Or
						</span>
						<div className='flex-grow border-t border-gray-300'></div>
					</div>

					<div className='flex gap-2'>
						<Link
							href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
						>
							<button className='relative bg-gray-50 text-gray-500 py-2 px-4 rounded border border-gray-300 basis-1/2'>
								<span className='absolute inset-y-0 left-0 flex items-center pl-4 text-blue-500 text-center'>
									<FontAwesomeIcon icon={faGoogle} />
								</span>
								Google
							</button>
						</Link>
						<Link
							href={`${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`}
						>
							<button className='relative bg-gray-50 text-gray-500 py-2 px-4 rounded border border-gray-300 basis-1/2'>
								<span className='absolute inset-y-0 left-0 flex items-center pl-4 text-blue-700'>
									<FontAwesomeIcon icon={faSquareFacebook} />
								</span>
								Facebook
							</button>
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
}
