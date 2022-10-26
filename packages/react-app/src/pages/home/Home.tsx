import React from 'react';
import SignOutButton from '../../components/SignOutButton';
import MainNavBar from '../../components/NavBars/MainNavBar';
import { useSelector } from 'react-redux';
import { selectDisplayName } from '../../redux/userSlice';
import GeneralSearchBar from '../../components/GeneralSearchBar';

export default function home() {
	const displayName = useSelector(selectDisplayName);

	return (
		<MainNavBar active={0}>
			<div>
				<div className='flex justify-center m-5'>
					<div className='w-96'>
						<GeneralSearchBar />
					</div>
				</div>
				<div className='text-2xl'>Welcome {displayName}!</div>
				<div>
					<SignOutButton />
				</div>
			</div>
		</MainNavBar>
	);
}
