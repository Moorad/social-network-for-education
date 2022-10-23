import React from 'react';
import SignOutButton from '../../components/SignOutButton';
import MainNavBar from '../../components/NavBars/MainNavBar';
import { useSelector } from 'react-redux';
import { selectDisplayName } from '../../redux/userSlice';

export default function home() {
	const displayName = useSelector(selectDisplayName);

	return (
		<MainNavBar active={0}>
			<div>
				<div className='text-2xl'>Welcome {displayName}!</div>
				<div>
					<SignOutButton />
				</div>
			</div>
		</MainNavBar>
	);
}
