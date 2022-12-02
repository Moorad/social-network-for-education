import type { CommentWithUser } from '../pages/post/[post]';
import React from 'react';
import { formatToRelativeTime } from '../utils/format';
import LikeButton from './LikeButton';
import { useSelector } from 'react-redux';
import { selectId } from '../redux/userSlice';
import axios from 'axios';
import { UserMinimal } from 'node-server/Models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

type propTypes = { data: CommentWithUser } & {
	isAuthor: boolean;
	replyHandler: (user: UserMinimal, commentId: string) => void
};

export default function Comment(props: propTypes) {
	const userId = useSelector(selectId);
	const isReply = props.data.parents.length > 1;

	function handleLiking() {
		axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comment/like?commentId=${props.data._id}`, {
			withCredentials: true
		});
	}

	function handleReplying() {
		props.replyHandler(props.data.user, props.data._id as string);
	}

	return (
		<div className='border-gray-300 py-5 text-left' style={{ marginLeft: `${(props.data.parents.length - 1) * 35}px` }}>
			{isReply && <div className='text-gray-400'>
				<FontAwesomeIcon icon={faReply} /> Replying
			</div>}
			<Link href={`/user/${props.data.user._id}`}>
				<div className='flex items-center gap-3 mt-4 cursor-pointer w-fit group'>
					<img src={props.data.user.avatar} className='w-9 rounded-full' />
					<div className='flex gap-2 items-center'>
						<div className='text-gray-700 font-medium group-hover:underline'>
							{props.data.user.displayName}
						</div>
						{props.isAuthor && (
							<span className='bg-emerald-100 text-emerald-600 text-sm px-2 rounded-full'>
								Original author
							</span>
						)}
						<div className='text-gray-500'>•</div>
						<div className='text-gray-500'>
							{formatToRelativeTime(props.data.created)}
						</div>
					</div>
				</div>
			</Link>
			<div className='text-gray-800 mt-3 whitespace-pre-wrap'>
				{props.data.content}
			</div>
			<div className='flex justify-between mt-5'>
				<div className='flex gap-12 px-2'>
					<LikeButton likeCount={props.data.likeCount} liked={props.data.likes.includes(userId)} handler={handleLiking} />
					<Link href='#comment-box'>
						<button onClick={handleReplying}>
							<div className='flex gap-2 items-center text-gray-500'>
								<FontAwesomeIcon icon={faReply} className='text-gray-400' /> Reply
							</div>
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

Comment.defaultProps = {
	isAuthor: false,
};
