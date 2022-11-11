import { faComment, faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { IPost, IUserMinimal } from 'common';
import { formatNumber, formatToRelativeTime } from '../utils/format';
import { useSelector } from 'react-redux';
import { selectId } from '../redux/userSlice';
import router from 'next/router';
import axios from 'axios';

const MAX_CHARACTER_LENGTH = 400;

export default function Post(props: {
	post: IPost;
	user: IUserMinimal;
	fullText: boolean;
}) {
	const userId = useSelector(selectId);
	const [liked, setLiked] = useState(props.post.likes.includes(userId));

	function handleLiking(e: React.MouseEvent) {
		e.stopPropagation();
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_URL}/post/like?postId=${props.post._id}`,
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

	function renderText() {
		if (
			props.fullText ||
			props.post.description.length <= MAX_CHARACTER_LENGTH
		) {
			return props.post.description;
		} else {
			return (
				props.post.description.substring(0, MAX_CHARACTER_LENGTH) +
				'...'
			);
		}
	}

	function handleClick() {
		if (props.fullText) {
			return;
		}

		router.push(`/post/${props.post._id}`);
	}

	return (
		<div
			className='border-gray-300 border rounded-lg p-5 text-left cursor-pointer'
			onClick={handleClick}
		>
			<div className='text-gray-900 font-semibold text-lg'>
				{props.post.title}
			</div>
			<div className='text-gray-800 mt-3 whitespace-pre-wrap'>
				{renderText()}
			</div>
			<div className='flex items-center gap-3 mt-4'>
				<img src={props.user.avatar} className='w-9 rounded-full' />
				<div className='flex gap-2'>
					<div className='text-gray-700 font-medium'>
						{props.user.displayName}
					</div>
					<div className='text-gray-500'>•</div>
					<div className='text-gray-500'>
						{formatToRelativeTime(props.post.created)}
					</div>
				</div>
			</div>
			<div className='flex justify-between mt-5'>
				<div className='flex gap-12 px-2'>
					<div className='flex gap-2 items-center'>
						{liked ? (
							<FontAwesomeIcon
								icon={faHeart}
								onClick={(e) => handleLiking(e)}
								className='cursor-pointer text-red-400'
							/>
						) : (
							<FontAwesomeIcon
								icon={faHeart}
								onClick={(e) => handleLiking(e)}
								className='cursor-pointer text-gray-400'
							/>
						)}
						<div className='select-none text-gray-800'>
							{formatNumber(props.post.likeCount)}
						</div>
					</div>
					<div className='flex gap-2 items-center'>
						<FontAwesomeIcon
							icon={faComment}
							className='text-gray-400'
						/>
						<div className='text-gray-800'>
							{formatNumber(props.post.commentCount)}
						</div>
					</div>
					<div className='flex gap-2 items-center'>
						<FontAwesomeIcon
							icon={faShare}
							className='text-gray-400'
						/>
						<div className='text-gray-800'>Share</div>
					</div>
				</div>

				<div className='text-gray-400'>102 views</div>
			</div>
		</div>
	);
}

Post.defaultProps = {
	fullText: false,
};
