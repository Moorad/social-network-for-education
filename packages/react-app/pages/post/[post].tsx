import type { PostType } from 'node-server/Models/Post';
import type { UserMinimal } from 'node-server/Models/User';
import type { CommentType } from 'node-server/Models/Comment';

import axios from 'axios';
import router, { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import Comment from '../../components/Comment';
import Loading from '../../components/Loading';
import MainNavBar from '../../components/NavBars/MainNavBar';
import Post from '../../components/Post';
import useAuth from '../../utils/hooks/useAuth';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type SinglePostWithUser = {
	post: PostType;
	user: UserMinimal;
} | null;


export type CommentWithUser = (CommentType & { user: UserMinimal })

type Comments = CommentWithUser[] | null;

export default function post() {
	const { query, isReady } = useRouter();
	const { fetching } = useAuth();
	const [data, setData] = useState<SinglePostWithUser>(null);
	const [comments, setComments] = useState<Comments>(null);
	const [replyingTo, setReplyingTo] = useState<UserMinimal & { commentId: string } | null>(null);
	const commentRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (!isReady) return;
		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/post?id=${query.post}`, {
				withCredentials: true,
			})
			.then((res) => {
				setData(res.data);
			});

		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_URL}/post/comments?postId=${query.post}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				setComments(res.data.comments);
			});

		axios.get(`${process.env.NEXT_PUBLIC_API_URL}/post/view?postId=${query.post}`, {
			withCredentials: true
		});
	}, [isReady]);

	function renderPost() {
		if (data == null) {
			return <Loading />;
		}

		return <Post user={data.user} post={data.post} fullText={true} />;
	}

	function renderComments() {
		if (comments == null) {
			return <Loading />;
		}

		// Sort by created time
		const timeSortedComments = comments.sort((a, b) =>
			new Date(a.created).getTime() -
			new Date(b.created).getTime());

		console.log(timeSortedComments);

		// Group by id
		const objectGroupedComments = timeSortedComments.reduce((prev, curr) => {
			if (curr.type == 'post') {
				prev[curr._id as string] = [];
			} else if (curr.type == 'reply') {
				prev[curr.commentId as string].push(curr._id);
			}

			return prev;
		}, Object.create(null));

		// Flatten groups to array of ids
		const flatIds = [];
		for (let i = 0; i < Object.keys(objectGroupedComments).length; i++) {
			flatIds.push(Object.keys(objectGroupedComments)[i]);
			flatIds.push(...objectGroupedComments[Object.keys(objectGroupedComments)[i]]);
		}

		// Map flat ids to initial object 
		const finalSortedComments = flatIds.map((id) => {
			return comments.find((comment) => comment._id == id)!;
		});

		return finalSortedComments.map((e, i) => {
			if (e.type == 'reply') {
				return (
					<div
						key={i}
						className={
							i != comments.length - 1
								? 'border-b border-gray-300'
								: ''
						}
					>
						<Comment
							key={i}
							data={e}
							replyUser={finalSortedComments.find((u) => u._id == e.commentId)?.user}
							isAuthor={e.user._id == data?.user._id}
							replyHandler={handleReplying}
						/>
					</div>
				);
			} else {
				return (
					<div
						key={i}
						className={
							i != comments.length - 1
								? 'border-b border-gray-300'
								: ''
						}
					>
						<Comment
							key={i}
							data={e}
							isAuthor={e.user._id == data?.user._id}
							replyHandler={handleReplying}
						/>
					</div>
				);
			}
		});
	}

	function handleSubmission(e: FormEvent) {
		e.preventDefault();
		let URL = `${process.env.NEXT_PUBLIC_API_URL}`;
		if (replyingTo) {
			URL += `/comment/reply?commentId=${replyingTo.commentId}`;
		} else {
			URL += `/post/comment?postId=${data?.post._id}`;
		}

		axios
			.post(
				URL,
				{
					content: commentRef.current?.value,
				},
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				if (res.status == 200) {
					router.reload();
				}
			});
	}

	function handleReplying(user: UserMinimal & { commentId: string }) {
		console.log(user);
		setReplyingTo(user);
	}

	if (fetching) {
		return <Loading />;
	}

	if (isReady) {
		return (
			<MainNavBar>
				<div className='flex'>
					<div className='flex-1 flex flex-col items-center'>
						<div className='w-3/4 m-5'>
							<div className='my-5'>{renderPost()}</div>
							<div>
								<div className='my-5 border-gray-300 border rounded-lg relative' id='comment-box'>
									{replyingTo && <div className='bg-gray-200 text-gray-600 px-5 py-1'>
										<FontAwesomeIcon icon={faReply} /> Replying to {replyingTo.displayName} </div>}
									<form onSubmit={handleSubmission}>
										<textarea
											className='w-full h-32 p-5 rounded-lg'
											placeholder='Write a comment'
											ref={commentRef}
										></textarea>
										<button
											className='bg-blue-500 text-white px-5 py-2 rounded-md text-sm absolute bottom-0 right-0 m-3'
											type='submit'
										>
											Send
										</button>
									</form>
								</div>
							</div>
							<div className='my-5 border-gray-300 border rounded-lg p-5 '>
								<div className='text-lg font-semibold text-gray-800'>
									Comments{' '}
									<span className='bg-blue-200 text-blue-600 px-3 rounded-full text-sm '>
										{data?.post.commentCount}
									</span>
								</div>
								<div>{renderComments()}</div>
							</div>
						</div>
					</div>
					<div className='w-64 bg-gray-200'>
						This will have something else
					</div>
				</div>
			</MainNavBar>
		);
	}
}
