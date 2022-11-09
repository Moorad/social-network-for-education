import axios from 'axios';
import { IPost, IUserMinimal } from 'common';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import MainNavBar from '../../components/NavBars/MainNavBar';
import Post from '../../components/Post';
import useAuth from '../../utils/hooks/useAuth';

type SinglePostWithUser = {
	post: IPost;
	user: IUserMinimal;
} | null;

export default function post() {
	const { query, isReady } = useRouter();
	const { isLoading } = useAuth();
	const [data, setData] = useState<SinglePostWithUser>(null);

	useEffect(() => {
		if (!isReady) return;
		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/post?id=${query.post}`, {
				withCredentials: true,
			})
			.then((res) => {
				setData(res.data);
			});
	}, [isReady]);

	function renderPost() {
		if (data == null) {
			return <Loading />;
		}

		return <Post user={data.user} post={data.post} fullText={true} />;
	}

	if (isLoading) {
		return <Loading />;
	}

	if (isReady) {
		return (
			<MainNavBar>
				<div className='flex'>
					<div className='flex-1 flex justify-center'>
						<div className='w-3/4 m-5'>{renderPost()}</div>
					</div>
					<div className='w-64 bg-gray-200'>
						This will have something else
					</div>
				</div>
			</MainNavBar>
		);
	}
}
