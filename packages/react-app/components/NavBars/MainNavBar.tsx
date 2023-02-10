import {
	faBell,
	faCog,
	faMessage,
	faQuestion,
	faRightFromBracket,
	faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu } from '@headlessui/react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import router from 'next/router';
import { selectAvatar, selectNotifications } from '../../redux/userSlice';
import useLogout from '../../utils/hooks/useLogout';
import SideNavBar from './SideNavBar';
import EmptyMessage from '../EmptyMessage';
import { NotificationType } from 'node-server/Models/User';
import { useMutation } from 'react-query';
import { clearNotificationsRequest } from '../../api/utilsApi';

type propTypes = {
	active: number;
	children: JSX.Element;
};

export default function MainNavBar(props: propTypes) {
	const avatar = useSelector(selectAvatar);
	return (
		<div className='flex flex-col h-screen'>
			<div className='flex justify-between shadow'>
				<div className=''>
					<Link href='/home'>
						<div className='bg-blue-500 w-20 h-20 flex justify-center align-middle items-center'>
							<img
								src='/logos/logo.png'
								className='m-autoa h-12'
							></img>
						</div>
					</Link>
				</div>
				<div className='flex items-center pr-4 gap-5'>
					<NotificationButton />
					<TopLeftAccountDropDown avatar={avatar} />
				</div>
			</div>

			<div className='flex flex-1 h-0'>
				<SideNavBar active={props.active} />
				<div
					className='flex-1 h-full overflow-y-auto'
					id='main-section'
				>
					{props.children}
				</div>
			</div>
		</div>
	);
}

function TopLeftAccountDropDown(props: { avatar: string }) {
	const logout = useLogout();
	const options = [
		{
			name: 'Profile',
			icon: faUser,
			onClick: () => router.push('/profile'),
		},
		{
			name: 'Settings',
			icon: faCog,
			onClick: () => router.push('/settings'),
		},
		{ name: 'Sign out', icon: faRightFromBracket, onClick: logout },
	];
	return (
		<Menu>
			{({ open }) => (
				<>
					<Menu.Button className='hover:bg-gray-200 p-2 rounded-full'>
						<img
							src={props.avatar}
							alt='profile image'
							className='w-12 rounded-full'
						/>
					</Menu.Button>
					{open && (
						<div className='absolute right-2 top-[78px] border-gray-300 border p-1 rounded-md mt-3 w-56 z-[100] bg-white'>
							<Menu.Items static>
								{options.map((e, i) => (
									<Menu.Item key={i}>
										<div
											className='m-1 p-2 pl-3 rounded-md hover:bg-blue-500 hover:text-white cursor-pointer'
											onClick={e.onClick}
										>
											<FontAwesomeIcon
												icon={e.icon}
												className='mr-2 '
											/>
											{e.name}
										</div>
									</Menu.Item>
								))}
							</Menu.Items>
						</div>
					)}
				</>
			)}
		</Menu>
	);
}

function NotificationButton() {
	const [hideNotifications, setHideNotifications] = useState(false);
	const notifications = useSelector(selectNotifications);
	const clearNotiMutation = useMutation(
		'clear_notifications',
		clearNotificationsRequest,
		{
			onSuccess: () => {
				console.log('done');
			},
		}
	);

	function getNotificationData(noti: NotificationType[]) {
		return noti.map((n) => {
			if (n.type == 'Message') {
				return {
					...n,
					icon: faMessage,
				};
			}

			if (n.type == 'Friend Request') {
				return {
					...n,
					icon: faUser,
				};
			}

			return {
				...n,
				icon: faQuestion,
			};
		});
	}

	function clearNotifications() {
		if (notifications.length > 0 && !hideNotifications) {
			setHideNotifications(true);
			clearNotiMutation.mutate();
		}
	}

	return (
		<Menu>
			{({ open }) => (
				<>
					<div className='relative'>
						<Menu.Button
							className='hover:bg-gray-200 p-2 rounded-md w-14 h-14'
							onClick={() => clearNotifications()}
						>
							<FontAwesomeIcon
								className='text-xl text-gray-700'
								icon={faBell}
							/>
						</Menu.Button>
						{hideNotifications == false &&
							notifications.length > 0 && (
								<div className='flex justify-center items-center -bottom-1 -right-1 absolute bg-red-500 text-white w-5 h-5 text-sm rounded-full'>
									{notifications.length}
								</div>
							)}
					</div>
					{open && (
						<div className='absolute right-2 top-[78px] border-gray-300 border p-3 rounded-md mt-3 w-96 z-[100] bg-white cursor-pointer'>
							<Menu.Items static>
								<div className='text-gray-900 font-bold mb-3'>
									Notifications
								</div>
								<EmptyMessage
									message='No recent notifications'
									value={notifications}
									background='bg-white'
								/>

								{getNotificationData(notifications).map(
									(n, i) => (
										<div
											key={i}
											className='hover:bg-gray-100 p-2 rounded-md'
										>
											<div className='flex'>
												<div className='relative self-center'>
													<img
														className='w-9 ml-1 mr-4 text-gray-700 rounded-full'
														src={`http://localhost:4000/resource/avatar?id=${n.user}`}
													/>
													<FontAwesomeIcon
														className='absolute text-xs rounded-md bg-blue-500 p-1 right-2 -bottom-1 text-white'
														icon={n.icon}
													/>
												</div>

												<div>
													<div className='text-sm font-semibold text-gray-700'>
														{n.type}
													</div>
													<div className='text-gray-700'>
														{n.text}
													</div>
												</div>
											</div>
										</div>
									)
								)}
							</Menu.Items>
						</div>
					)}
				</>
			)}
		</Menu>
	);
}

MainNavBar.defaultProps = {
	active: -1,
};
