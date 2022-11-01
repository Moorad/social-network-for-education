// import React from 'react';
import axios from 'axios';
import router from 'next/router';

export default function useLogout() {
	return () => {
		axios
			.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
				withCredentials: true,
			})
			.then(() => router.push('/signin'));
	};
}
