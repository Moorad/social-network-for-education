import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IUserMinimal } from 'common';
import React from 'react';

type propTypes = {
	data: { content: string; user: IUserMinimal };
};

export default function Comment(props: propTypes) {
	return (
		<div className='border-gray-300 p-5 text-left cursor-pointer'>
			<div className='flex items-center gap-3 mt-4'>
				<img
					src={props.data.user.avatar}
					className='w-9 rounded-full'
				/>
				<div className='flex gap-2'>
					<div className='text-gray-700 font-medium'>
						{props.data.user.displayName}
					</div>
					<div>•</div>
					{/* <div>{formatToRelativeTime(props.post.created)}</div> */}
					2h
				</div>
			</div>
			<div className='text-gray-800 mt-3 whitespace-pre-wrap'>
				{props.data.content}
			</div>
			<div className='flex justify-between mt-5'>
				<div className='flex gap-12 px-2'>
					<div className='flex gap-2 items-center'>
						<FontAwesomeIcon
							icon={faHeart}
							className='cursor-pointer text-gray-400'
						/>
						<div className='select-none text-gray-800'>0</div>
					</div>
				</div>
			</div>
		</div>
	);
}
