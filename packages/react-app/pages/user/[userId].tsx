import React from 'react';
import { useRouter } from 'next/router';
import useAuth from '../../utils/hooks/useAuth';
import Loading from '../../components/Loading';
import User from '../../components/User';

export default function UserProfile() {
	const { query, isReady } = useRouter();
	const { isLoading } = useAuth();

	if (isLoading) {
		return <Loading />;
	}

	if (isReady) {
		return <User id={query.userId as string} />;
	}
}
