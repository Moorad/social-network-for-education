import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faSquareFacebook } from '@fortawesome/free-brands-svg-icons';

export default class SignUpForm extends Component {
	render() {
		return (
			<div className='w-fit bg-gray-50 px-10 py-16 rounded-lg'>
				<div className='text-3xl font-extrabold text-center pb-10'>
					Sign up to {'{name}'}
				</div>
				<form className='flex flex-col gap-7'>
					<input placeholder='Display Name' type='text' className='border border-gray-300 rounded w-96 px-4 py-1' required/>
					<input placeholder='Email address' type='email' className='border border-gray-300 rounded w-96 px-4 py-1' required/>
					<input placeholder='Password' type='password' className='border border-gray-300 rounded w-96 px-4 py-1' required/>
					<button className='bg-blue-500 text-white py-2 px-4 rounded'>Create your account</button>
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
						Sign in with Google
					</button>
					<button className='relative bg-gray-50 text-gray-500 py-2 px-4 rounded border border-gray-300'>
						<span className='absolute inset-y-0 left-0 flex items-center pl-4 text-blue-700'>
							<FontAwesomeIcon icon={faSquareFacebook} />
						</span>
						Sign in with Facebook
					</button>
				</div>

			</div>
		)
	}
}