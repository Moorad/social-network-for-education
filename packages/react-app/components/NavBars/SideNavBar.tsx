import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faBell,
	faCog,
	faHouseChimney,
	faMessage,
	faPenToSquare,
	faUser,
	IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import PostModal from '../PostModal';
import { useDispatch } from 'react-redux';
import { showPostModal } from '../../redux/modalsSlice';

const navigation = [
	{ name: 'Home', href: '/home', icon: faHouseChimney },
	{ name: 'Profile', href: '/profile', icon: faUser },
	{ name: 'Chat', href: '/NA', icon: faMessage },
	{ name: 'Notifications', href: '/NA', icon: faBell },
	{ name: 'Settings', href: '/NA', icon: faCog },
];

export default function SideNavBar(props: { active: number }) {
	const dispatch = useDispatch();

	return (
		<>
			<PostModal />
			<div className='flex flex-col w-20 h-full bg-gray-800 items-center py-4'>
				<div
					className='w-14 h-14 flex items-center justify-center text-xl text-white rounded-md mb-4 bg-blue-500 hover:bg-blue-400'
					onClick={() => dispatch(showPostModal())}
				>
					<FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
				</div>
				{navigation.map((e, i) => {
					return (
						<SideBarButton
							icon={e.icon}
							active={i == props.active}
							key={i}
							href={e.href}
						/>
					);
				})}
			</div>
		</>
	);
}

type sideBarButtonTypes = {
	active: boolean;
	icon: IconDefinition;
	href: string;
};

function SideBarButton(props: sideBarButtonTypes) {
	let extraClasses = '';
	if (props.active) {
		extraClasses = 'bg-gray-600';
	}

	return (
		<Link href={props.href}>
			<div
				className={`w-14 h-14 flex items-center justify-center text-xl text-white rounded-md mb-4 hover:bg-gray-700 ${extraClasses}`}
			>
				<FontAwesomeIcon icon={props.icon}></FontAwesomeIcon>
			</div>
		</Link>
	);
}
