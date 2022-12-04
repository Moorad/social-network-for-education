// import React from 'react';
import router from 'next/router';
import toast from 'react-hot-toast';
import { useMutation } from 'react-query';
import { logoutUser } from '../../api/authApi';

export default function useLogout() {
	const logoutMutation = useMutation('logout', logoutUser, {
		onSuccess: () => {
			router.push('/signin');
		},
		onError: () => {
			toast.error('Failed to logout');
		}
	});

	return () => {
		logoutMutation.mutate();
	};
}
