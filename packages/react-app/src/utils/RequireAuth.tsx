import axios from 'axios';
import React, { useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import Loading from '../components/Loading';
import { setUser } from '../redux/userSlice';

function RequireAuth() {
	const [isFetching, setIsFetching] = useState(true);
	const [validToken, setValidToken] = useState(false);
	const location = useLocation();
	const dispatch = useDispatch();

	useLayoutEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			setValidToken(false);
			setIsFetching(false);
		}

		axios
			.get(process.env.REACT_APP_API_URL + '/api/user', {
				headers: {
					authorization: `Bearer ${token}`,
				},
				withCredentials: true,
			})
			.then((res) => {
				if (res.status == 200) {
					dispatch(setUser(res.data));
					setValidToken(true);
				}
			})
			.catch(() => {
				setValidToken(false);
			})
			.finally(() => setIsFetching(false));
	}, []);

	if (isFetching) {
		return <Loading />;
	}

	return validToken ? (
		<Outlet />
	) : (
		<Navigate to='/signin' state={{ from: location }} replace />
	);
}

export default RequireAuth;
