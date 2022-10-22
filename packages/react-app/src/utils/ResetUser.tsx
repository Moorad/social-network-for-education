import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ResetUser() {
	localStorage.clear();
	return <Navigate to='/signin' state={{ from: location }} replace />;
}
