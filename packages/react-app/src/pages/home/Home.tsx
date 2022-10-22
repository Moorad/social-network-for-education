import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SignOutButton from '../../components/SignOutButton';
import MainNavBar from '../../components/NavBars/MainNavBar';
import ResetUser from '../../utils/ResetUser';

export default function home() {
	const [user, setUser] = useState({
		displayName: '',
		description: '',
		label: '',
		followerCount: 0,
		followingCount: 0,
		posts: [],
		avatar: '',
	});
	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_API_URL}/api/user`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then((res) => {
				if (res.status == 200) {
					setUser(res.data);
					console.log(user);
				}
			})
			.catch((err) => {
				if (err.response && err.response.status == 404) {
					ResetUser();
				}
			});
	}, []);

	return (
		<MainNavBar active={0}>
			<div>
				<div className='text-2xl'>Welcome {user.displayName}!</div>
				<div>
					<SignOutButton />
				</div>
			</div>
		</MainNavBar>
	);
}
