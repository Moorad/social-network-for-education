import React, { FormEvent, useRef } from 'react';
import router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import Link from 'next/link';
import { useMutation } from 'react-query';
import { loginUser } from '../../api/authApi';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import Button from '../Button';

export default function SignIn() {
	const emailRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const loginMutation = useMutation('login', loginUser, {
		onSuccess: () => {
			router.push('/home');
		},
		onError: (error) => {
			const err = error as AxiosError;
			switch (err.response?.status) {
				case 403:
					toast.error('Incorrect email address or password');
					break;
				case 400:
					toast.error('Incorrect email address or password');
					break;
				default:
					toast.error(
						'The server has encountered an internal error, please try again later'
					);
					break;
			}
		},
	});

	function handleSubmission(e: FormEvent) {
		e.preventDefault();
		if (emailRef.current && passwordRef.current) {
			loginMutation.mutate({
				email: emailRef.current.value.toLowerCase(),
				password: passwordRef.current.value,
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
				<div className='flex justify-end text-sm gap-3 text-white mt-4'>
					<Button variant='primary' type='submit'>
						Submit
					</Button>
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
							<Button additionalClasses='relative basis-1/2'>
								<span className='absolute inset-y-0 left-0 flex items-center pl-4 text-blue-500 text-center'>
									<FontAwesomeIcon icon={faGoogle} />
								</span>
								Google
							</Button>
						</Link>
						<Link
							href={`${process.env.NEXT_PUBLIC_API_URL}/auth/facebook`}
						>
							<Button additionalClasses='relative basis-1/2'>
								<span className='absolute inset-y-0 left-0 flex items-center pl-4 text-blue-700'>
									<FontAwesomeIcon icon={faSquareFacebook} />
								</span>
								Facebook
							</Button>
						</Link>
					</div>
				</div>
			</form>
		</div>
	);
}
