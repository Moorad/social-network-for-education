import React from 'react';
import Link from 'next/link';
import Button from '../components/Button';

export default function Custom404() {
	return (
		<div className='inset-center'>
			<div className='flex flex-col items-center gap-12'>
				<img src='/undraw_404.svg' className='w-3/4 inline m-auto' />
				<div className='text-gray-600 dark:text-gray-300 text-center text-xl'>
					It seems like the page you are looking for does not exist.
				</div>
				<div>
					<Link href='/home'>
						<Button variant='primary'>Go back to home</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
