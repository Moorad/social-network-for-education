import { faComment, faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { IPost, IUserMinimal } from 'common';
import { formatNumber } from '../utils/format';
export default function Post(props: { post: IPost; user: IUserMinimal }) {
	return (
		<div className='border-gray-300 border rounded-lg p-5 text-left'>
			<div className='text-gray-900 font-semibold text-lg'>
				{props.post.title}
			</div>
			<div className='text-gray-800 mt-3'>{props.post.description}</div>
			<div className='flex items-center gap-3 mt-4'>
				<img src={props.user.avatar} className='w-9 rounded-full' />
				<div className='flex gap-2'>
					<div className='text-gray-700 font-medium'>
						{props.user.displayName}
					</div>
					<div>•</div>
					<div>2h</div>
				</div>
			</div>
			<div className='flex justify-between mt-5'>
				<div className='flex gap-12 px-2'>
					<div className='flex gap-2 items-center'>
						<FontAwesomeIcon icon={faHeart} />
						<div>{formatNumber(props.post.likes)}</div>
					</div>
					<div className='flex gap-2 items-center'>
						<FontAwesomeIcon icon={faComment} />
						<div>{formatNumber(props.post.comments.length)}</div>
					</div>
					<div className='flex gap-2 items-center'>
						<FontAwesomeIcon icon={faShare} />
						<div>Share</div>
					</div>
				</div>

				<div>102 views</div>
			</div>
		</div>
	);
}
