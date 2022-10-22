import axios from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

function RequireAuth() {
	const [isFetching, setIsFetching] = useState(true);
	const [validToken, setValidToken] = useState(false);
	const location = useLocation();

	useLayoutEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			setValidToken(false);
			setIsFetching(false);
		}

		axios
			.get(process.env.REACT_APP_API_URL + '/api/auth/token', {
				headers: {
					authorization: `Bearer ${token}`,
				},
			})
			.then((res) => {
				if (res.status == 200) {
					setValidToken(true);
				}
			})
			.catch(() => {
				setValidToken(false);
			})
			.finally(() => setIsFetching(false));
	});

	if (isFetching) {
		return <div>loading</div>;
	}

	return validToken ? (
		<Outlet />
	) : (
		<Navigate to='/signin' state={{ from: location }} replace />
	);
}

export default RequireAuth;
