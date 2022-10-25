// import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function useLogout() {
	const navigate = useNavigate();
	return () => {
		axios
			.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`, {
				withCredentials: true,
			})
			.then(() => navigate('/signin'));
	};
}
