import React from 'react';
import MainNavBar from '../../components/NavBars/MainNavBar';
import { useSelector } from 'react-redux';
import { selectDisplayName } from '../../redux/userSlice';
import GeneralSearchBar from '../../components/GeneralSearchBar';
import useAuth from '../../utils/hooks/useAuth';
import Loading from '../../components/Loading';

export default function home() {
	const { isLoading } = useAuth();
	const displayName = useSelector(selectDisplayName);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<MainNavBar active={0}>
			<div>
				<div className='flex justify-center m-5'>
					<div className='w-96'>
						<GeneralSearchBar />
					</div>
				</div>
				<div className='text-2xl'>Welcome {displayName}!</div>
				<div></div>
			</div>
		</MainNavBar>
	);
}
