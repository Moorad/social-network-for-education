import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SignOutButton from '../../components/SignOutButton';

export default function home() {
	const [user, setUser] = useState('');
	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_API_URL}/api/user`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then((res) => {
				if (res.status == 200) {
					setUser(res.data.displayName);
				} else {
					throw res.data.message;
				}
			});
	});

	return (
		<div>
			<div className='text-2xl'>Welcome {user}!</div>
			<div>
				<SignOutButton />
			</div>
		</div>
	);
}
