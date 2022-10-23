import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { selectAvatar } from '../../redux/userSlice';
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
					<div>
						<img
							src={avatar}
							alt='profile image'
							className='w-14 rounded-full'
						/>
					</div>
				</div>
			</div>

			<div className='flex h-screen'>
				<SideNavBar active={props.active} />
				<div className='flex-1'>{props.children}</div>
			</div>
		</div>
	);
}
