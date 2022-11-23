import React from 'react';
import Loading from '../../components/Loading';
import User from '../../components/User';
import useAuth from '../../utils/hooks/useAuth';

export default function Profile() {
	const { fetching } = useAuth();

	if (fetching) {
		return <Loading />;
	}

	return <User me={true} />;
}
