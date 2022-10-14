import React from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

function RequireAuth() {
	const location = useLocation();

	const token = localStorage.getItem('token');

	return token ? (
		<Outlet />
	) : (
		<Navigate to='/signin' state={{ from: location }} replace />
	);
}

export default RequireAuth;
