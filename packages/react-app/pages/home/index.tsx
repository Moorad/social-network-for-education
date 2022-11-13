import React, { useEffect } from 'react';
import MainNavBar from '../../components/NavBars/MainNavBar';
import { useSelector } from 'react-redux';
import { selectDisplayName } from '../../redux/userSlice';
import GeneralSearchBar from '../../components/GeneralSearchBar';
import useAuth from '../../utils/hooks/useAuth';
import Loading from '../../components/Loading';

export default function home() {
	const { isLoading } = useAuth();
	const displayName = useSelector(selectDisplayName);

	useEffect(() => {
		// Removes the #_=_ hash from facebook login
		// https://developers.facebook.com/support/bugs/318390728250352/
		window.history.replaceState(
			'',
			document.title,
			window.location.pathname
		);
	}, []);

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
