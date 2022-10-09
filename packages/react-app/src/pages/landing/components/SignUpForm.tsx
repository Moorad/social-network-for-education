import React, { Component, FormEvent, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faSquareFacebook } from '@fortawesome/free-brands-svg-icons';

export default function SignUpForm() {
	const [error, setError] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	const [displayName, setDisplayName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	function handleSubmission(e: FormEvent) {
		e.preventDefault();
		setError('');
		setIsFetching(true);
		fetch('http://localhost:4000/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"displayName": displayName,
				"email": email,
				"password": password
			})
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`${res.status} ${res.statusText}`);
				}
				
				return res.json();
			})
			.catch((err) => {
				setError(err.name + ": " + err.message);
			})
			.then((res) => {
				console.log(res)
				setIsFetching(false);
			})
	}

	function loadingButton() {
		if (isFetching) {
			return (
				<div className='flex justify-center'>
					<svg className="mr-3 h-6 w-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
					</svg>
				</div>
			);
		} else {
			return "Create your account";
		}
	}

	return (
		<div className='w-fit h-fit bg-gray-50 px-10 py-16 rounded-lg align-middle'>
			<div className='text-3xl font-bold text-center pb-20'>
				Sign up to {'{name}'}
			</div>
			<div className={"text-red-500 mb-5 text-center bg-red-100 p-1 rounded border border-red-500" + (error != '' ? '' : ' hidden')}>
				{error}
			</div>
			<form className='flex flex-col gap-7' onSubmit={handleSubmission}>
				<button className='bg-blue-500 text-white py-2 px-4 rounded w-96'>
					{loadingButton()}
				</button>
			</form>
			<div className='flex flex-col gap-6 mt-5'>
				{/* This is the divider */}
				<div className='relative flex items-center'>
					<div className='flex-grow border-gray-300 border-t'></div>
					<span className='flex-shrink mx-4 text-gray-500 text-sm'>
						Or
					</span>
					<div className='flex-grow border-t border-gray-300'></div>
				</div>

				<button className='relative bg-gray-50 text-gray-500 py-2 px-4 rounded border border-gray-300'>
					<span className='absolute inset-y-0 left-0 flex items-center pl-4 text-blue-500'>
						<FontAwesomeIcon icon={faGoogle} />
					</span>
					Sign up with Google
				</button>
				<button className='relative bg-gray-50 text-gray-500 py-2 px-4 rounded border border-gray-300'>
					<span className='absolute inset-y-0 left-0 flex items-center pl-4 text-blue-700'>
						<FontAwesomeIcon icon={faSquareFacebook} />
					</span>
					Sign up with Facebook
				</button>
				<div className='relative mt-16'>
					<div className='my-3 text-gray-400 font-medium'>
						Already have an account?
					</div>
					<button className='relative bg-gray-500 text-white py-2 px-4 rounded w-full'>
						Sign in
					</button>
				</div>
			</div>

		</div>
	)
}