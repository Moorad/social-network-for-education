import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import router from 'next/router';

export default function useAuth() {
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		axios
			.get(process.env.NEXT_PUBLIC_API_URL + '/api/user', {
				withCredentials: true,
			})
			.then((res) => {
				if (res.status == 200) {
					dispatch(setUser(res.data));
				} else {
					router.push('/signin');
				}
			})
			.catch(() => {
				router.push('/signin');
			})
			.finally(() => setIsLoading(false));
	}, []);

	return {
		isLoading: isLoading,
	};
}
