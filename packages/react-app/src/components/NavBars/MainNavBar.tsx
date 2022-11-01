import { faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Menu } from '@headlessui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { selectAvatar } from '../../redux/userSlice';
import useLogout from '../../utils/hooks/useLogout';
import SideNavBar from './SideNavBar';

type propTypes = {
	active: number;
	children: JSX.Element;
};

export default function MainNavBar(props: propTypes) {
	const avatar = useSelector(selectAvatar);
	return (
		<div>
			<div className='flex justify-between shadow'>
				<div className=''>
					<Link to='/home'>
						<div className='bg-blue-500 w-20 h-20 flex justify-center align-middle items-center'>
							<img src={logo} className='m-autoa h-12'></img>
						</div>
					</Link>
				</div>
				<div className='flex items-center pr-4'>
					<TopLeftAccountDropDown avatar={avatar} />
				</div>
			</div>

			<div className='flex h-screen'>
				<SideNavBar active={props.active} />
				<div className='flex-1 overflow-y-auto'>{props.children}</div>
			</div>
		</div>
	);
}

function TopLeftAccountDropDown(props: { avatar: string }) {
	const logout = useLogout();
	const navigate = useNavigate();
	const options = [
		{ name: 'Profile', icon: faUser, onClick: () => navigate('/profile') },
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
