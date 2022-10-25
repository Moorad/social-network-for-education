import React from 'react';
import useLogout from '../utils/hooks/useLogout';

export default function SignOutButton() {
	const logout = useLogout();

	return (
		<button
			onClick={logout}
			className='bg-gray-500 text-white py-2 px-4 rounded'
		>
			Sign Out
		</button>
	);
}
