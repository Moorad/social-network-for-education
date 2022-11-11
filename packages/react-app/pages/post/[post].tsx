import axios from 'axios';
import { IPost, IUserMinimal } from 'common';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Comment from '../../components/Comment';
import Loading from '../../components/Loading';
import MainNavBar from '../../components/NavBars/MainNavBar';
import Post from '../../components/Post';
import useAuth from '../../utils/hooks/useAuth';

type SinglePostWithUser = {
	post: IPost;
	user: IUserMinimal;
} | null;

type Comments =
	| {
			content: string;
			user: IUserMinimal;
	  }[]
	| null;

export default function post() {
	const { query, isReady } = useRouter();
	const { isLoading } = useAuth();
	const [data, setData] = useState<SinglePostWithUser>(null);
	const [comments, setComments] = useState<Comments>(null);

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

		return comments.map((e, i) => {
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
						content={e.content}
						user={e.user}
						isAuthor={e.user._id == data?.user._id}
					/>
				</div>
			);
		});
	}

	if (isLoading) {
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
								<div className='my-5 border-gray-300 border rounded-lg relative'>
									<textarea
										className='w-full h-32 p-5 rounded-lg'
										placeholder='Write a comment'
									></textarea>
									<button className='bg-blue-500 text-white px-5 py-2 rounded-md text-sm absolute bottom-0 right-0 m-3'>
										Send
									</button>
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
