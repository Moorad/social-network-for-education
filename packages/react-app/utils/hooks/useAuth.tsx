import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import router from 'next/router';
import { useQuery } from 'react-query';
import { UserType } from 'node-server/Models/User';
import { getUserMe } from '../../api/userApi';

export default function useAuth(redirect = true) {
	const [fetching, setFetching] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);
	const dispatch = useDispatch();
	const { data } = useQuery<UserType>('user_me', getUserMe, {
		onSuccess: (res) => {
			dispatch(setUser(res));
			setAuthenticated(true);
			setFetching(false);
		},
		onError: () => {
			setAuthenticated(false);

			if (redirect) {
				router.push('/signin');
			} else {
				setFetching(false);
			}
		}
	});

	return {
		fetching: fetching,
		authenticated: authenticated,
		user: data
	};
}