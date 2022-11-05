import React, { useEffect, useRef, useState } from 'react';
import MainNavBar from './NavBars/MainNavBar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCamera,
	faCirclePlus,
	faFaceSadTear,
	faLock,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setAvatar } from '../redux/userSlice';
import { formatNumber } from '../utils/format';
import Post from './Post';
import { IPost, IUserMinimal, IUserSafe } from 'common';

type propTypes = {
	id?: string;
	me?: boolean;
};

type IPostWithUser = {
	posts: IPost[];
	user: IUserMinimal;
} | null;

export default function User(props: propTypes) {
	const [user, setUser] = useState<IUserSafe>({
		displayName: '',
		description: '',
		label: 'No label',
		followerCount: 0,
		followingCount: 0,
		posts: [],
		avatar: '',
		_id: '',
		isPrivate: false,
	});
	const firstRender = useRef<boolean>(true);
	const [postData, setPostData] = useState<IPostWithUser>(null);
	const dispatch = useDispatch();
	const reduxUser = useSelector(selectUser);
	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (props.me) {
			setUser(reduxUser);
		} else {
			axios
				.get(`${process.env.NEXT_PUBLIC_API_URL}/user?id=${props.id}`, {
					withCredentials: true,
				})
				.then((res) => {
					if (res.status == 200) {
						setUser(res.data);
					}
				})
				.catch((err) => {
					if (err.response && err.response.status == 404) {
						console.log('user not found');
					}
				});
		}
	}, []);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}

		if (user.posts.length > 0 && (!user.isPrivate || props.me)) {
			fetchPosts();
		}
	}, [user]);

	function fetchPosts() {
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_URL}/user/posts${
					props.id ? `?id=${props.id}` : ''
				}`,
				{
					withCredentials: true,
				}
			)
			.then((res) => {
				setPostData(res.data);
			});
	}

	function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			const imageFile = e.target.files[0];

			const formData = new FormData();

			formData.append('file', imageFile);

			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/resource/upload`,
					formData,
					{
						withCredentials: true,
						data: formData,
					}
				)
				.then((res) => {
					const url: string = res.data.url;
					dispatch(setAvatar(url));
					setUser({
						...user,
						avatar: url,
					});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}

	function handleAvatarClick() {
		if (fileRef.current) {
			fileRef.current.click();
		}
	}

	function renderPosts() {
		if (user.isPrivate) {
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

		return postData?.posts
			.sort(
				(a, b) =>
					new Date(b.created).getTime() -
					new Date(a.created).getTime()
			)
			.map((e, i) => <Post post={e} user={postData.user} key={i} />);
	}

	return (
		<div>
			{props.me && (
				<input
					type='file'
					onChange={(e) => handleAvatarUpload(e)}
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
								// onClick={handleAvatarClick}
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
							src='/background.jpg'
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
										onClick={handleAvatarClick}
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
								<button className='bg-blue-500 text-white py-2 px-7 rounded-md'>
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
