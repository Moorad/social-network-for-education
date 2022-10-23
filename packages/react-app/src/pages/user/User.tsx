import React, { useEffect, useRef, useState } from 'react';
import MainNavBar from '../../components/NavBars/MainNavBar';
import background from '../../assets/images/background.jpg';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';

type propTypes = {
	id?: string;
	me?: boolean;
};

export default function User(props: propTypes) {
	const [user, setUser] = useState({
		displayName: '',
		description: '',
		label: 'No label',
		followerCount: 0,
		followingCount: 0,
		posts: [],
		avatar: '',
	});
	const reduxUser = useSelector(selectUser);
	const fileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (props.me) {
			setUser(reduxUser);
		} else {
			axios
				.get(
					`${process.env.REACT_APP_API_URL}/api/user?id=${props.id}`,
					{
						headers: {
							authorization: `Bearer ${localStorage.getItem(
								'token'
							)}`,
						},
					}
				)
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

	function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			const imagePreview = URL.createObjectURL(e.target.files[0]);
			const imageFile = e.target.files[0];

			const formData = new FormData();

			formData.append('file', imageFile);

			axios
				.post(`${process.env.REACT_APP_API_URL}/api/upload`, formData, {
					headers: {
						authorization: `Bearer ${localStorage.getItem(
							'token'
						)}`,
					},
					data: formData,
				})
				.then(() => {
					setUser({
						...user,
						avatar: imagePreview,
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

	return (
		<div className='overflow-hidden h-screen'>
			{props.me && (
				<input
					type='file'
					onChange={(e) => handleImageUpload(e)}
					ref={fileRef}
					accept='.png'
					className='hidden'
				/>
			)}

			<MainNavBar active={props.me ? 1 : -1}>
				<div className='text-gray-800'>
					<img
						src={background}
						alt='background image'
						className='h-64 w-full object-cover'
					/>
					<div className='flex px-40 justify-between items-end h-24'>
						<div className='flex items-end gap-10'>
							<div className='translate-y-4 select-none'>
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
									alt='profile picture'
									className='h-44 w-44 max-w-max border rounded-full overflow-hidden'
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
									{user.followerCount}
								</div>
								<div>Followers</div>
							</div>
							<div className='text-center'>
								<div className='font-semibold text-xl'>
									{user.followingCount}
								</div>
								<div>Following</div>
							</div>
							<div className='text-center'>
								<div className='font-semibold text-xl'>
									{user.posts.length}
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
					<div className='text-center m-20 text-gray-500'>
						Posts go here
					</div>
				</div>
			</MainNavBar>
		</div>
	);
}
