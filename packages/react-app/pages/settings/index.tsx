import React, { useState } from 'react';
import Loading from '../../components/Loading';
import MainNavBar from '../../components/NavBars/MainNavBar';
import useAuth from '../../utils/hooks/useAuth';
import Profile from '../../components/Settings/Profile';
import Account from '../../components/Settings/Account';
import General from '../../components/Settings/General';

export default function Settings() {
	const { fetching } = useAuth();
	const [currentPage, setCurrentPage] = useState(0);
	const pages = [
		{
			name: 'General',
			component: <General />
		},
		{
			name: 'Profile',
			component: <Profile />
		},
		{
			name: 'Account',
			component: <Account />
		},
	];

	if (fetching) {
		return <Loading />;
	}

	return (
		<MainNavBar active={4}>
			<div className='flex h-full bg-gray-100'>
				<div className='m-2 p-5 bg-white rounded-md'>
					<div className='text-gray-800 font-bold text-2xl'>Settings</div>
					<div className='text-gray-500 font-semibold flex flex-col gap-3 my-3'>
						{pages.map((e, i) => <button key={i} className={'text-left ' + (currentPage == i ? 'text-blue-500' : '')} onClick={() => setCurrentPage(i)}>{e.name}</button>)}
					</div>
				</div>
				<div className='my-2 mr-2 p-5 bg-white flex-1 rounded-md overflow-y-auto'>
					{pages[currentPage].component}
				</div>
			</div>
		</MainNavBar>
	);
}
