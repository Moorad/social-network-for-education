import React, { useEffect } from 'react';
import Link from 'next/link';
import useAuth from '../../utils/hooks/useAuth';
import Button from '../Button';

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
							<img
								src='/logos/logo.png'
								className='w-auto h-12'
							></img>
						</div>
					</Link>
					<a href='#features'>Features</a>
					<a href='#development'>Development</a>
					<a href='#details'>Project details</a>
				</div>

				<div className='inline-flex items-center'>
					{authenticated ? (
						<Link href='/home'>
							<Button variant='primary'>Home</Button>
						</Link>
					) : (
						<Link href='/signin'>
							<Button>Log in</Button>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
