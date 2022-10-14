import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignOutButton() {
	console.log(process.env);
	const navigate = useNavigate();
	function handleClick() {
		localStorage.clear();
		navigate('/');
	}

	return (
		<button
			onClick={handleClick}
			className='bg-gray-500 text-white py-2 px-4 rounded'
		>
			Sign Out
		</button>
	);
}
