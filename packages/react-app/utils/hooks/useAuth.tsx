import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import router from 'next/router';

export default function useAuth(redirect = true) {
	const [fetching, setFetching] = useState(true);
	const [authenticated, setAuthenticated] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		axios
			.get(process.env.NEXT_PUBLIC_API_URL + '/user', {
				withCredentials: true
			})
			.then((res) => {
				// User authenticated
				if (res.status == 200) {
					dispatch(setUser(res.data));
					setAuthenticated(true);
					setFetching(false);
				} else { // User is not authenticated 
					setAuthenticated(false);

					if (redirect) {
						router.push('/signin');
					} else {
						setFetching(false);
					}
				}
			})
			.catch(() => {
				setAuthenticated(false);

				if (redirect) {
					router.push('/signin');
				} else {
					setFetching(false);
				}
			});
	}, []);

	return {
		fetching: fetching,
		authenticated: authenticated
	};
}