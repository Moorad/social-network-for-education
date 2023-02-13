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

const navigation = [
	{ name: 'Home', href: '/home', icon: faHouseChimney },
	{ name: 'Profile', href: '/profile', icon: faUser },
	{ name: 'Chat', href: '/chat', icon: faMessage },
	{ name: 'Notifications', href: '/NA', icon: faBell },
	{ name: 'Settings', href: '/settings', icon: faCog },
];

export default function SideNavBar(props: { active: number }) {
	return (
		<>
			<div className='flex flex-col w-20 bg-slate-800 items-center py-4'>
				<Link href='/editor'>
					<div className='w-14 h-14 flex items-center justify-center text-xl text-white rounded-md mb-4 bg-blue-500 hover:bg-blue-400'>
						<FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
					</div>
				</Link>
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
		extraClasses = 'bg-slate-600';
	}

	return (
		<Link href={props.href}>
			<button
				className={`w-14 h-14 flex items-center justify-center text-xl text-white rounded-md mb-4 hover:bg-slate-700 ${extraClasses}`}
			>
				<FontAwesomeIcon icon={props.icon}></FontAwesomeIcon>
			</button>
		</Link>
	);
}
