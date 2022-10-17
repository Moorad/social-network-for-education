import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

export default function LandingNavBar() {
	return (
		<div className='max-w-auto p-5'>
			<div className='flex justify-between'>
				<div className='inline-flex items-center gap-3 text-white font-medium'>
					<Link to='/'>
						<img src={logo} className='w-auto h-12 mr-5'></img>
					</Link>
					<a>Features</a>
					<a>Development</a>
					<a>Contact</a>
				</div>

				<div className='inline-flex items-center'>
					<Link to='/signin'>
						<button className='bg-gray-500 text-white py-2 px-4 rounded'>
							Log in
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
