// import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetUser() {
	const navigate = useNavigate();
	localStorage.clear();
	navigate('/signin');
}
