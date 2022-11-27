import type { CommentWithUser } from '../pages/post/[post]';
import React from 'react';
import { formatToRelativeTime } from '../utils/format';
import LikeButton from './LikeButton';
import { useSelector } from 'react-redux';
import { selectId } from '../redux/userSlice';
import axios from 'axios';

type propTypes = { data: CommentWithUser } & {
	isAuthor: boolean;
};

export default function Comment(props: propTypes) {
	const userId = useSelector(selectId);

	function handleLiking() {
		axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comment/like?commentId=${props.data._id}`, {
			withCredentials: true
		});
	}

	return (
		<div className='border-gray-300 py-5 text-left cursor-pointer'>
			<div className='flex items-center gap-3 mt-4'>
				<img src={props.data.user.avatar} className='w-9 rounded-full' />
				<div className='flex gap-2 items-center'>
					<div className='text-gray-700 font-medium'>
						{props.data.user.displayName}
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
					<LikeButton likeCount={props.data.likeCount} liked={props.data.likes.includes(userId)} handler={handleLiking} />
				</div>
			</div>
		</div>
	);
}

Comment.defaultProps = {
	isAuthor: false,
};
