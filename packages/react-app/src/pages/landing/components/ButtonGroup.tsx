import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

export default function ButtonGroup() {
	return (
		<div className='w-fit h-fit bg-gray-50 px-10 py-16 rounded-lg align-middle'>
			<div className='text-3xl font-bold text-center pb-20'>
				Sign up to {'{name}'}
			</div>
			<Link to='/signup'>
				<button className='bg-blue-500 text-white py-2 px-4 rounded w-96'>
					Create an account
				</button>
			</Link>
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
					<Link to='/signin'>
						<button className='relative bg-gray-500 text-white py-2 px-4 rounded w-full'>
							Sign in
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
