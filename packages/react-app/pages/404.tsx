import React from 'react';
import Link from 'next/link';

export default function Custom404() {
	return (
		<div className='inset-center'>
			<div className='flex flex-col items-center gap-12'>
				<img src='/undraw_404.svg' className='w-3/4 inline m-auto' />
				<div className='text-gray-600 text-center text-xl'>
					It seems like the page you are looking for does not exist.
				</div>
				<div>
					<Link href='/home'>
						<button className='bg-blue-500 text-white py-2 px-4 rounded'>
							Go back to home
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
