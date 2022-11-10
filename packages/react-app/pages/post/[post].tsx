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

		return comments.map((e, i) => <Comment key={i} data={e} />);
	}

	if (isLoading) {
		return <Loading />;
	}

	if (isReady) {
		return (
			<MainNavBar>
				<div className='flex'>
					<div className='flex-1 flex flex-col items-center'>
						<div className='w-3/4'>
							<div className='m-5'>{renderPost()}</div>
							<div className='m-5'>
								Comments: {data?.post.commentCount}
							</div>
							<div className='m-5'>{renderComments()}</div>
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
