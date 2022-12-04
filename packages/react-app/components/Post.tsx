import type { PostType } from 'node-server/Models/Post';
import type { UserMinimal } from 'node-server/Models/User';

import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { formatNumber, formatToRelativeTime } from '../utils/format';
import { useSelector } from 'react-redux';
import { selectId } from '../redux/userSlice';
import router from 'next/router';
import ShareButton from './ShareButton';
import LikeButton from './LikeButton';
import Link from 'next/link';
import { useMutation, useQueryClient } from 'react-query';
import { likePost } from '../api/postApi';
import toast from 'react-hot-toast';

const MAX_CHARACTER_LENGTH = 400;

export default function Post(props: {
	post: PostType;
	user: UserMinimal;
	fullText: boolean;
}) {
	const userId = useSelector(selectId);
	const queryClient = useQueryClient();
	const likeMutation = useMutation(likePost, {
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
		onError: () => {
			toast.error('Failed to like the post');
		}
	});

	function handleLiking() {
		likeMutation.mutate(props.post._id as string);
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
			className={'border-gray-300 border rounded-lg p-5 text-left ' + (!props.fullText ? 'cursor-pointer' : '')}
			onClick={handleClick}
		>
			<div className='text-gray-900 font-semibold text-lg'>
				{props.post.title}
			</div>
			<div className='text-gray-800 mt-3 whitespace-pre-wrap'>
				{renderText()}
			</div>
			<Link href={`/user/${props.user._id}`}>
				<div className='flex items-center gap-3 mt-4 w-fit cursor-pointer group' onClick={(e) => e.stopPropagation()}>
					<img src={props.user.avatar} className='w-9 rounded-full' />
					<div className='flex gap-2'>
						<div className='text-gray-700 font-medium group-hover:underline'>
							{props.user.displayName}
						</div>
						<div className='text-gray-500'>•</div>
						<div className='text-gray-500'>
							{formatToRelativeTime(props.post.created)}
						</div>
					</div>
				</div>
			</Link>
			<div className='flex justify-between mt-5'>
				<div className='flex gap-12 px-2'>
					<LikeButton likeCount={props.post.likeCount} liked={props.post.likes.includes(userId)} handler={handleLiking} />
					<div className='flex gap-2 items-center'>
						<FontAwesomeIcon
							icon={faComment}
							className='text-gray-400'
						/>
						<div className='text-gray-500'>
							{formatNumber(props.post.commentCount)}
						</div>
					</div>
					<ShareButton postId={props.post._id as string} postTitle={props.post.title} />
				</div>

				<div className='text-gray-400'>{props.post.viewCount} views</div>
			</div>
		</div>
	);
}

Post.defaultProps = {
	fullText: false,
};
