import React, { useEffect } from 'react';
import MainNavBar from '../../components/NavBars/MainNavBar';
import GeneralSearchBar from '../../components/GeneralSearchBar';
import useAuth from '../../utils/hooks/useAuth';
import Loading from '../../components/Loading';
import { PostType } from 'node-server/Models/Post';
import Post from '../../components/Post';
import { UserMinimal } from 'node-server/Models/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useInfiniteQuery } from 'react-query';
import { userFeed } from '../../api/userApi';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

type APIResponseType = PostType & { user: UserMinimal };

export default function home() {
	const { fetching } = useAuth();
	const limit = 10;
	const { isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, data } =
		useInfiniteQuery<APIResponseType[]>(['feed'], userFeed, {
			getNextPageParam: (lastPage, pages) => {
				if (lastPage.length < limit) {
					return undefined;
				}

				return pages.length * limit;
			},
			onError: () => {
				toast.error('Failed to fetch more posts');
			},
		});

	useEffect(() => {
		document
			.getElementById('main-section')
			?.addEventListener('scroll', trackScrolling);

		return () => {
			document
				.getElementById('main-section')
				?.removeEventListener('scroll', trackScrolling);
		};
	}, [trackScrolling]);

	function trackScrolling(e: Event) {
		const target = e.target as HTMLDivElement;
		if (
			target &&
			target.scrollHeight - target.scrollTop <= target.clientHeight
		) {
			if (!isFetchingNextPage && hasNextPage) {
				fetchNextPage();
			}
		}
	}

	function renderPosts() {
		return data?.pages.map((page, pi) => {
			return page.map((p, i) => (
				<Post post={p} user={p.user} key={pi * 10 + i} />
			));
		});
	}

	if (fetching || isLoading) {
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
				<div className='flex flex-col m-auto mt-20 text-gray-500 w-[50rem] gap-5'>
					{renderPosts()}
					{isFetchingNextPage && (
						<div className='p-3'>
							<Loader />
						</div>
					)}
					{!hasNextPage && (
						<div className='text-center dark:text-gray-300'>
							<div className='m-5'>
								<div>
									<FontAwesomeIcon
										icon={faCheckCircle}
										className='text-xl mb-2'
									/>
								</div>
								You are up to date
							</div>
						</div>
					)}
				</div>
			</div>
		</MainNavBar>
	);
}
