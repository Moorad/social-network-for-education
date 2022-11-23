import React, { useEffect } from 'react';
import Link from 'next/link';
import useAuth from '../../utils/hooks/useAuth';

export default function LandingNavBar() {
	const { fetching, authenticated } = useAuth(false);

	useEffect(() => {
		if (fetching) return;

		console.log(authenticated);
	}, [fetching]);


	return (
		<div className='max-w-auto py-10 px-20'>
			<div className='flex justify-between'>
				<div className='inline-flex items-center gap-8 font-medium'>
					<Link href='/'>
						<div className='bg-blue-500 p-2 rounded-lg'>
							<img src='/logos/logo.png' className='w-auto h-12'></img>
						</div>
					</Link>
					<a href='#features'>Features</a>
					<a href='#development'>Development</a>
					<a href='#details'>Project details</a>
				</div>

				<div className='inline-flex items-center'>
					{authenticated ? <Link href='/home'>
						<button className='bg-blue-500 text-white py-2 px-4 rounded'>
							Home
						</button>
					</Link> : <Link href='/signin'>
						<button className='bg-gray-500 text-white py-2 px-4 rounded'>
							Log in
						</button>
					</Link>}
				</div>
			</div>
		</div>
	);
}
