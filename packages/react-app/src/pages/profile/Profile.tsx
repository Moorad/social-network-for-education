import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ResetUser from '../../utils/ResetUser';
import User from '../user/User';

export default function Profile() {
	const [isFetching, setIsFetching] = useState(true);
	const [id, setId] = useState('');
	useEffect(() => {
		axios
			.get(`${process.env.REACT_APP_API_URL}/api/user`, {
				headers: {
					authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			.then((res) => {
				if (res.status == 200) {
					setId(res.data._id);
					setIsFetching(false);
				}
			})
			.catch((err) => {
				if (err.response && err.response.status == 404) {
					ResetUser();
				}
			});
	}, []);

	if (isFetching) {
		return <div>loading</div>;
	}

	return <User id={id} />;
}
