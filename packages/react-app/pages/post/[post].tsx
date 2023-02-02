import type { PostType } from 'node-server/Models/Post';
import type { UserMinimal } from 'node-server/Models/User';
import type { CommentType } from 'node-server/Models/Comment';

import { useRouter } from 'next/router';
import React, { FormEvent, useRef, useState } from 'react';
import Comment from '../../components/Comment';
import Loading from '../../components/Loading';
import MainNavBar from '../../components/NavBars/MainNavBar';
import Post from '../../components/Post';
import useAuth from '../../utils/hooks/useAuth';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SortCommentsDFS } from '../../utils/sort';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
	commentOnPost,
	getPost,
	getPostComments,
	viewedPost,
} from '../../api/postApi';
import { replyToComment } from '../../api/commentApi';
import toast from 'react-hot-toast';
import { getIconFromMimeType } from '../../utils/file';

type SinglePostWithUser = {
	post: PostType;
	user: UserMinimal;
} | null;

export type CommentWithUser = CommentType & { user: UserMinimal };

type Comments = {
	comments: CommentWithUser[];
} | null;

export default function post() {
	const { query, isReady } = useRouter();
	const { fetching } = useAuth();
	const [replyingTo, setReplyingTo] = useState<{
		displayName: string;
		commentId: string;
	} | null>(null);
	const commentRef = useRef<HTMLTextAreaElement>(null);

	const queryClient = useQueryClient();
	const postQuery = useQuery<SinglePostWithUser>(
		['post', query.post],
		() => getPost(query.post as string),
		{
			enabled: isReady,
			onError: () => {
				toast.error('Failed to fetch the post');
			},
		}
	);
	const commentsQuery = useQuery<Comments>(
		['comments', query.post],
		() => getPostComments(query.post as string),
		{
			enabled: isReady,
			onError: () => {
				toast.error('Failed to fetch post comments');
			},
		}
	);
	const commentMutation = useMutation('comment', commentOnPost, {
		onSuccess: () => {
			queryClient.invalidateQueries();
			toast.success('Comment posted successfully');
			if (commentRef.current) {
				commentRef.current.value = '';
			}
		},
		onError: () => {
			toast.error('Failed to submit the comment');
		},
	});
	const replyMutation = useMutation('reply', replyToComment, {
		onSuccess: () => {
			queryClient.invalidateQueries();
			toast.success('Comment posted successfully');
			if (commentRef.current) {
				commentRef.current.value = '';
			}
		},
		onError: () => {
			toast.error('Failed to submit the reply comment');
		},
	});
	// Send a request to count the view
	useQuery(['view', query.post], () => viewedPost(query.post as string), {
		enabled: isReady,
	});

	function renderComments() {
		if (commentsQuery.data) {
			const comments = commentsQuery.data.comments;

			comments.sort((a, b) => {
				return a.parents.length - b.parents.length;
			});

			return SortCommentsDFS(comments).map((e, i) => {
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
							isAuthor={e.user._id == postQuery.data?.user._id}
							replyHandler={handleReplying}
						/>
					</div>
				);
			});
		}
	}

	function handleSubmission(e: FormEvent) {
		e.preventDefault();

		if (replyingTo) {
			replyMutation.mutate({
				commentId: replyingTo.commentId,
				content: commentRef.current?.value,
			});
		} else {
			commentMutation.mutate({
				postId: postQuery.data?.post._id as string,
				content: commentRef.current?.value,
			});
		}
	}

	function handleReplying(user: UserMinimal, commentId: string) {
		setReplyingTo({
			displayName: user.displayName,
			commentId: commentId,
		});
	}

	if (
		fetching ||
		!isReady ||
		postQuery.isLoading ||
		commentsQuery.isLoading
	) {
		return <Loading />;
	}

	return (
		<MainNavBar>
			<div className='flex'>
				<div className='flex-1 flex flex-col items-center'>
					<div className='w-3/4 m-5 max-w-[60rem]'>
						<div className='my-5'>
							{postQuery.data && (
								<Post
									user={postQuery.data.user}
									post={postQuery.data.post}
									fullText={true}
								/>
							)}
						</div>
						<div>
							<div
								className='my-5 border-gray-300 border rounded-lg relative'
								id='comment-box'
							>
								{replyingTo && (
									<div className='bg-gray-200 text-gray-600 px-5 py-1'>
										<FontAwesomeIcon icon={faReply} />{' '}
										Replying to {replyingTo.displayName}{' '}
									</div>
								)}
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
						<div className='my-5 border-gray-300 border rounded-lg p-5'>
							<div className='text-lg font-semibold text-gray-800'>
								Comments{' '}
								<span className='bg-blue-200 text-blue-600 px-3 rounded-full text-sm '>
									{postQuery.data?.post.commentCount}
								</span>
							</div>
							<div>{renderComments()}</div>
						</div>
					</div>
				</div>
				<div className='w-64 bg-gray-100 p-5'>
					<div className='text-center font-semibold'>Attachments</div>
					{postQuery.data &&
						postQuery.data.post.attachments &&
						postQuery.data.post.attachments.length == 0 && (
							<div className='text-gray-500 p-4 items-center text-center gap-4 rounded-md text-md'>
								No files attached with this post.
							</div>
						)}
					<div className='flex flex-col gap-3'>
						{postQuery.data &&
							postQuery.data.post.attachments &&
							postQuery.data.post.attachments.length > 0 &&
							postQuery.data.post.attachments.map((e, i) => {
								const icon = getIconFromMimeType(e.mime);
								return (
									<a
										target='_blank'
										rel='noreferrer'
										href={e.url}
										key={i}
										className='no-underline text-black cursor-pointer'
									>
										<div className='flex text-center items-center w-full gap-4 hover:bg-gray-200 p-5 rounded-md'>
											<FontAwesomeIcon
												icon={icon.icon}
												className={
													'text-3xl ' + icon.color
												}
											/>
											<div className='break-words text-sm'>
												{e.name}
											</div>
										</div>
									</a>
								);
							})}
					</div>
					<div className='text-center font-semibold mb-3'>
						References
					</div>
					{postQuery.data &&
						postQuery.data.post.references &&
						postQuery.data.post.references.length == 0 && (
							<div className='text-gray-500 p-4 items-center text-center gap-4 rounded-md text-md'>
								No references provided for this post.
							</div>
						)}

					<div className='flex flex-wrap gap-2 text-sm mb-3 justify-center'>
						{postQuery.data &&
							postQuery.data.post.references &&
							postQuery.data.post.references.length > 0 &&
							postQuery.data.post.references.map((ref, i) => {
								return (
									<div
										className='bg-gray-100 hover:bg-gray-200 p-3 rounded-md text-sm cursor-pointer w-full'
										key={i}
									>
										<div className='font-semibold'>
											{ref.title}
										</div>
										<div className='text-blue-500 underline break-words'>
											<a
												href={`https://doi.org/${ref.DOI}`}
												target='_blank'
												rel='noreferrer'
											>
												https://doi.org/{ref.DOI}
											</a>
										</div>
										<div className='flex flex-wrap justify-between'>
											<div>{ref.authors.join(', ')}</div>
											<div>
												{new Date(
													ref.creation
												).getFullYear()}
											</div>
										</div>
									</div>
								);
							})}
					</div>
					<div className='text-center font-semibold mb-3'>Tags</div>
					{postQuery.data &&
						postQuery.data.post.tags &&
						postQuery.data.post.tags.length == 0 && (
							<div className='text-gray-500 p-4 items-center text-center gap-4 rounded-md text-md'>
								No tags provided for this post.
							</div>
						)}

					<div className='flex flex-wrap gap-2 text-sm mb-3 justify-center'>
						{postQuery.data &&
							postQuery.data.post.tags &&
							postQuery.data.post.tags.length > 0 &&
							postQuery.data.post.tags.map((e, i) => {
								return (
									<span
										className='px-3 py-1 rounded-sm bg-gray-200 text-gray-700'
										key={i}
									>
										{e}
									</span>
								);
							})}
					</div>
				</div>
			</div>
		</MainNavBar>
	);
}
