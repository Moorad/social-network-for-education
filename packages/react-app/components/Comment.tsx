import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CommentType } from '../pages/post/[post]';
import React from 'react';
import { formatToRelativeTime } from '../utils/format';

type propTypes = CommentType & {
	isAuthor: boolean;
};

export default function Comment(props: propTypes) {
	return (
		<div className='border-gray-300 py-5 text-left cursor-pointer'>
			<div className='flex items-center gap-3 mt-4'>
				<img src={props.user.avatar} className='w-9 rounded-full' />
				<div className='flex gap-2 items-center'>
					<div className='text-gray-700 font-medium'>
						{props.user.displayName}
					</div>
					{props.isAuthor && (
						<span className='bg-emerald-100 text-emerald-600 text-white text-sm px-2 rounded-full'>
							Original author
						</span>
					)}
					<div className='text-gray-500'>•</div>
					<div className='text-gray-500'>
						{formatToRelativeTime(props.data.created)}
					</div>
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
						<div className='select-none text-gray-800'>
							{props.data.likeCount}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

Comment.defaultProps = {
	isAuthor: false,
};
