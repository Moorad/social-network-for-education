import { faComment, faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { IPost, IUserMinimal } from 'common';
import { formatNumber, formatToRelativeTime } from '../utils/format';
import { useSelector } from 'react-redux';
import { selectId } from '../redux/userSlice';
import axios from 'axios';
export default function Post(props: { post: IPost; user: IUserMinimal }) {
	const userId = useSelector(selectId);
	const [liked, setLiked] = useState(props.post.likes.includes(userId));

	function handleLiking() {
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_URL}/api/like_post?postId=${props.post._id}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				if (res.status == 200) {
					if (!liked) {
						props.post.likeCount++;
						setLiked(true);
					} else {
						props.post.likeCount--;
						setLiked(false);
					}
				}
			});
	}

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
					<div>{formatToRelativeTime(props.post.created)}</div>
				</div>
			</div>
			<div className='flex justify-between mt-5'>
				<div className='flex gap-12 px-2'>
					<div className='flex gap-2 items-center'>
						{liked ? (
							<FontAwesomeIcon
								icon={faHeart}
								onClick={() => handleLiking()}
								className='cursor-pointer text-red-400'
							/>
						) : (
							<FontAwesomeIcon
								icon={faHeart}
								onClick={() => handleLiking()}
								className='cursor-pointer'
							/>
						)}
						<div className='select-none'>
							{formatNumber(props.post.likeCount)}
						</div>
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
