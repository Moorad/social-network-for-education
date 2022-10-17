import React from 'react';
import MainNavBar from '../../components/NavBars/MainNavBar';

export default function Profile() {
	return (
		<div className='overflow-hidden h-screen'>
			<MainNavBar active={1}>
				<div></div>
			</MainNavBar>
		</div>
	);
}
