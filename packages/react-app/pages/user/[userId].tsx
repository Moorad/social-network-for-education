import React from 'react';
import { useRouter } from 'next/router';
import useAuth from '../../utils/hooks/useAuth';
import Loading from '../../components/Loading';
import User from '../../components/User';

export default function UserProfile() {
	const router = useRouter();
	const { isLoading } = useAuth();
	const { userId } = router.query;

	if (isLoading) {
		return <Loading />;
	}

	return <User id={userId as string} />;
}
