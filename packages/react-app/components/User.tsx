/* eslint-disable no-var */
import type { UserMinimal, UserType } from 'node-server/Models/User';
import type { PostType } from 'node-server/Models/Post';

import React, { useRef, useState } from 'react';
import MainNavBar from './NavBars/MainNavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCamera,
	faCheck,
	faCirclePlus,
	faFaceSadTear,
	faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUser } from '../redux/userSlice';
import { formatNumber } from '../utils/format';
import Post from './Post';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { followUser, getUser, getUserMe, getUserPosts, getUserPostsMe, uploadUserImage } from '../api/userApi';
import Loading from './Loading';
import toast from 'react-hot-toast';

type propTypes = {
	id?: string;
	me?: boolean;
};

type PostWithUser = {
	posts: PostType[];
	user: UserMinimal;
} | null;

export type uploadForTypes = 'Avatar' | 'Profile_Background';

export default function User(props: propTypes) {
	const reduxUser = useSelector(selectUser);
	const fileRef = useRef<HTMLInputElement>(null);
	const forRef = useRef<uploadForTypes>('Avatar');
	const [following, setFollowing] = useState(false);
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	if (props.me) {
		var { isLoading, isError, data: user } = useQuery<UserType>('user_me', getUserMe, {
			onSuccess: (data) => {
				dispatch(setUser(data));
			}
		});
		var postQuery = useQuery<PostWithUser>('posts_me', getUserPostsMe);
	} else {
		var { isLoading, isError, data: user } = useQuery<UserType>(['user', props.id], () => getUser(props.id), {
			onSuccess: (res) => {
				if (res.followers.includes(reduxUser._id)) {
					setFollowing(true);
				}
			}
		});
		var postQuery = useQuery<PostWithUser>(['posts', props.id], () => getUserPosts(props.id));
	}

	const followMutation = useMutation(followUser, {
		onSuccess: () => {
			setFollowing(!following);
			queryClient.invalidateQueries();
		},
		onError: () => {
			toast.error('Failed to follow the user');
		}
	});

	const uploadMutation = useMutation(uploadUserImage, {
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
		onError: () => {
			toast.error('Failed to upload image');
		}
	});

	if (isLoading || postQuery.isLoading || user == undefined) {
		return <Loading />;
	}

	if (isError) {
		toast.error('Something went wrong!');
		return <div></div>;
	}

	function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			const imageFile = e.target.files[0];

			const formData = new FormData();

			formData.append('file', imageFile);

			uploadMutation.mutate({
				formData: formData,
				_for: forRef.current
			});
		}
	}

	function handleUploadClick(_for: ('Avatar' | 'Profile_Background')) {
		forRef.current = _for;

		if (fileRef.current) {
			fileRef.current.click();
		}
	}

	function renderPosts() {
		if (!postQuery.data || !user) {
			return;
		}

		if (user.isPrivate && !props.me) {
			return (
				<div>
					<FontAwesomeIcon icon={faLock} className='text-lg' />
					<div className='text-lg'>This account is private</div>
				</div>
			);
		}

		if (user.posts.length == 0 && props.me) {
			return (
				<div className='flex flex-col gap-5 border-2 border-gray-400 border-dashed w-[30rem] m-auto p-5 rounded-lg'>
					<FontAwesomeIcon
						icon={faCirclePlus}
						className='text-5xl text-gray-500'
					/>
					<div>
						<div className='text-gray-900 font-bold'>
							Create a post
						</div>
						<div className='text-gray-600'>
							Its seems like you do have any posts. Create your
							first post now!
						</div>
					</div>
					<div>
						<button className='bg-blue-500 text-white py-2 px-7 rounded-md'>
							Create
						</button>
					</div>
				</div>
			);
		}

		if (user.posts.length == 0) {
			return (
				<div>
					<FontAwesomeIcon icon={faFaceSadTear} className='text-lg' />
					<div className='text-lg'>
						This account does not have any posts
					</div>
				</div>
			);
		}

		const _user = postQuery.data.user;
		return postQuery.data.posts
			.sort(
				(a, b) =>
					new Date(b.created).getTime() -
					new Date(a.created).getTime()
			)
			.map((e, i) => <Post post={e} user={_user} key={i} />);
	}

	function handleFollow() {
		followMutation.mutate(props.id);
	}

	return (
		<div>
			{props.me && (
				<input
					type='file'
					onChange={(e) => handleImageUpload(e)}
					ref={fileRef}
					accept='.png,.jpg,.jpeg'
					className='hidden'
				/>
			)}

			<MainNavBar active={props.me ? 1 : -1}>
				<div className='text-gray-800'>
					<div className='bg-gray-100 h-64 relative'>
						{props.me && (
							<div
								className='absolute h-full w-full bg-gray-800/[.5] opacity-0 hover:opacity-100 cursor-pointer '
								onClick={() => handleUploadClick('Profile_Background')}
							>
								<div className='flex w-full h-full justify-center items-center'>
									<FontAwesomeIcon
										icon={faCamera}
										className='text-white text-5xl'
									/>
								</div>
							</div>
						)}
						<img
							src={user.background}
							alt='background image'
							className='h-full w-full object-cover'
						/>
					</div>
					<div className='flex px-40 justify-between items-end h-24'>
						<div className='flex items-end gap-10'>
							<div className='translate-y-4 select-none h-44 w-44 rounded-full bg-gray-200'>
								{props.me && (
									<div
										className='absolute h-44 w-44 bg-gray-800/[.5] rounded-full opacity-0 hover:opacity-100 cursor-pointer '
										onClick={() => handleUploadClick('Avatar')}
									>
										<div className='flex w-full h-full justify-center items-center'>
											<FontAwesomeIcon
												icon={faCamera}
												className='text-white text-5xl'
											/>
										</div>
									</div>
								)}
								<img
									src={user.avatar}
									className='h-44 aspect-square rounded-full outline-white outline-8 outline'
								/>
							</div>
							<div>
								<div className='text-3xl font-semibold'>
									{user.displayName}
								</div>
								<div className='rounded-full bg-red-100 text-red-600 font-medium text-center w-max px-4'>
									{user.label}
								</div>
							</div>
						</div>
						<div className='flex gap-10'>
							<div className='text-center'>
								<div className='font-semibold text-xl'>
									{formatNumber(user.followerCount)}
								</div>
								<div>Followers</div>
							</div>
							<div className='text-center'>
								<div className='font-semibold text-xl'>
									{formatNumber(user.followingCount)}
								</div>
								<div>Following</div>
							</div>
							<div className='text-center'>
								<div className='font-semibold text-xl'>
									{user.isPrivate
										? '-'
										: formatNumber(user.posts.length)}
								</div>
								<div>posts</div>
							</div>
						</div>
						<div>
							{!props.me && (
								following ? <button className='text-gray-500 border-gray-300 border py-2 px-7 rounded-md' onClick={() => handleFollow()}>
									<FontAwesomeIcon icon={faCheck} /> Following
								</button> : <button className='bg-blue-500 text-white py-2 px-7 rounded-md' onClick={() => handleFollow()}>
									Follow
								</button>
							)}
						</div>
					</div>
					<div className='mx-40 my-20 px-64 font-medium text-lg'>
						{user.description}
					</div>
					<div className='px-40'>
						<div className='w-full border-b border-gray-300'></div>
					</div>
					<div className='flex flex-col justify-center text-center m-auto my-20 text-gray-500 w-[50rem] gap-5'>
						{renderPosts()}
					</div>
				</div>
			</MainNavBar>
		</div>
	);
}
