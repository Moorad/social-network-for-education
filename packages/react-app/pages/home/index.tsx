import React, { useEffect, useState } from 'react';
import MainNavBar from '../../components/NavBars/MainNavBar';
import GeneralSearchBar from '../../components/GeneralSearchBar';
import useAuth from '../../utils/hooks/useAuth';
import Loading from '../../components/Loading';
import axios from 'axios';
import { PostType } from 'node-server/Models/Post';
import Post from '../../components/Post';
import { UserMinimal } from 'node-server/Models/User';

type APIResponseType = PostType & { user: UserMinimal }

export default function home() {
	const { isLoading } = useAuth();
	const [posts, setPosts] = useState<APIResponseType[]>([]);
	const [skip, setSkip] = useState(0);
	const [viewedAll, setViewedAll] = useState(false);
	const limit = 10;

	useEffect(() => {
		// Removes the #_=_ hash from facebook login
		// https://developers.facebook.com/support/bugs/318390728250352/
		window.history.replaceState(
			'',
			document.title,
			window.location.pathname
		);
	}, []);

	useEffect(() => {
		document.getElementById('main-section')?.addEventListener('scroll', trackScrolling);

		return () => {
			document.getElementById('main-section')?.removeEventListener('scroll', trackScrolling);
		};
	}, [trackScrolling]);


	useEffect(() => {
		axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/feed?type=following&skip=${skip}&limit=${limit}`, {
			withCredentials: true
		}).then((res) => {
			if (res.status == 200) {
				setPosts(posts.concat(res.data));
				setViewedAll(res.data.length < 10);
			}
		});
	}, [skip]);

	function trackScrolling(e: Event) {
		const target = e.target as HTMLDivElement;

		if (target && target.scrollHeight - target.scrollTop === target.clientHeight) {
			if (!viewedAll) {
				setSkip(skip + limit);
			}
		}
	}

	if (isLoading) {
		return <Loading />;
	}

	return (
		<MainNavBar active={0}>
			<div>
				<div className='flex justify-center m-5'>
					<div className='w-96'>
						<GeneralSearchBar />
					</div>
				</div>

				<div className='flex flex-col m-auto my-20 text-gray-500 w-[50rem] gap-5'>
					{posts.map((e, i) => {
						return <Post post={e} user={e.user} key={i} />;
					})}
					{viewedAll && <div className='text-center'>You are up to date</div>}
				</div>
			</div>
		</MainNavBar>
	);
}
