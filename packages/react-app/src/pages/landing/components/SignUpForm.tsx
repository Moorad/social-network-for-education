import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
const inputStyles ='border border-gray-300 rounded w-96 px-4 py-1';

export default class SignUpForm extends Component {
	render() {
		return (
			<div className='w-fit bg-gray-50 p-5 rounded-lg'>
				<div className='text-2xl font-bold text-center py-10'>
					Sign up to {'{name}'}
				</div>
				<div className='flex flex-col gap-7'>
					<Input placeholder='Display Name' type='text' overrideClassName={inputStyles} />
					<Input placeholder='Email address' type='email' overrideClassName={inputStyles}/>
					<Input placeholder='Password' type='password' overrideClassName={inputStyles}/>
					<Button value='Create your account'/>
					
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