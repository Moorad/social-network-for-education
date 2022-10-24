import React from 'react';
import LandingNavBar from '../../components/NavBars/LandingNavBar';
import MainNavBar from '../../components/NavBars/MainNavBar';
import undraw_404 from '../../assets/images/undraw_404.svg';
import { Link } from 'react-router-dom';

export default function NotFound() {
	return (
		<div className='inset-center'>
			<div className='flex flex-col items-center gap-12'>
				<img src={undraw_404} className='w-3/4 m-0 inline m-auto' />
				<div className='text-gray-600 text-center text-xl'>
					It seems like the page you are looking for does not exist.
				</div>
				<div>
					<Link to='/home'>
						<button className='bg-blue-500 text-white py-2 px-4 rounded'>
							Go back to home
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
