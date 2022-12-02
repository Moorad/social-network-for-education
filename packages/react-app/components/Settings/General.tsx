import React from 'react';
import Toggle from '../Toggle';

export default function General() {
	return (
		<div>
			<div className='text-gray-800 font-bold text-2xl'>General</div>
			<div className='text-gray-500'>These are general settings to alter your experience</div>
			<div className='flex flex-col gap-7 py-5'>
				<div className='flex flex-col w-fit gap-1'>
					<label htmlFor='Label' className='text-sm font-medium text-gray-800'>Dark mode</label>
					<Toggle />
				</div>
			</div>
		</div>
	);
}
