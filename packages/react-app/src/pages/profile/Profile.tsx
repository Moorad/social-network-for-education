import React, { useEffect, useState } from 'react';
import MainNavBar from '../../components/NavBars/MainNavBar';
import background from '../../assets/images/background.jpg';
import axios from 'axios';

export default function Profile() {
	const [user, setUser] = useState('');
	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_API_URL}/api/user`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then((res) => {
				if (res.status == 200) {
					setUser(res.data.displayName);
				} else {
					throw res.data.message;
				}
			});
	});

	return (
		<div className='overflow-hidden h-screen'>
			<MainNavBar active={1}>
				<div className='text-gray-800'>
					<img
						src={background}
						alt='background image'
						className='h-64 w-full object-cover'
					/>
					<div className='flex px-40 justify-between items-end h-24'>
						<div className='flex items-end gap-10'>
							<div className='translate-y-4'>
								<img
									src={`${process.env.REACT_APP_API_URL}/api/image/default`}
									alt='profile picture'
									className='h-44 border rounded-full overflow-hidden'
								/>
							</div>
							<div>
								<div className='text-3xl font-semibold'>
									{user}
								</div>
								<div className='rounded-full bg-red-100 text-red-600 font-medium text-center w-max px-4'>
									Role
								</div>
							</div>
						</div>
						<div className='flex gap-10'>
							<div className='text-center'>
								<div className='font-semibold text-xl'>00k</div>
								<div>Followers</div>
							</div>
							<div className='text-center'>
								<div className='font-semibold text-xl'>00k</div>
								<div>Following</div>
							</div>
							<div className='text-center'>
								<div className='font-semibold text-xl'>00k</div>
								<div>Posts</div>
							</div>
						</div>
						<div>
							<button className='bg-blue-500 text-white py-2 px-7 rounded-md'>
								Follow
							</button>
						</div>
					</div>
					<div className='mx-40 my-20 px-64 font-medium text-lg'>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Aenean quis nibh sagittis, finibus justo eget, sagittis
						urna. Nam convallis tortor enim, a imperdiet est varius
						et. Maecenas ac nulla commodo, mollis enim sed, sagittis
						tortor. Vestibulum volutpat feugiat lacinia.
					</div>
					<div className='px-40'>
						<div className='w-full border-b border-gray-300'></div>
					</div>
					<div className='text-center m-20 text-gray-500'>
						Posts go here
					</div>
				</div>
			</MainNavBar>
		</div>
	);
}
