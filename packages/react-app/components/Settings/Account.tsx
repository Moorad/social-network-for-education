import { faGoogle, faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

export default function Account() {
	const router = useRouter();
	const [changed, setChanged] = useState(false);
	const [error, setError] = useState('');
	const [data, setData] = useState({
		email: '',
		strategy: '',
		password: ''
	});
	const confirmPassword = useRef<HTMLInputElement>(null);
	const newPassword = useRef<HTMLInputElement>(null);

	useEffect(() => {
		axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/email`, {
			withCredentials: true
		}).then((res) => {
			if (res.status == 200) {
				setData({
					...data,
					...res.data
				});
			}
		});
	}, []);

	useEffect(() => {
		if (changed) {
			toast('You have unsaved changes', {
				icon: <FontAwesomeIcon icon={faExclamationCircle} className='text-yellow-600' />,
				position: 'bottom-center',
				duration: Infinity
			});
		} else {
			toast.dismiss();
		}
	}, [changed]);

	function changeData() {
		if (!newPassword.current || !confirmPassword.current) {
			return;
		}

		if (newPassword.current.value === confirmPassword.current.value && newPassword.current.value.length >= 8) {
			setError('');
			setChanged(true);
			return setData({
				...data,
				password: newPassword.current.value
			});
		}

		setChanged(false);

		if (newPassword.current.value.length == 0) {
			return setError('');
		}

		if (newPassword.current.value.length < 8) {
			return setError('Password must be 8 or more characters long');
		}

		if (newPassword.current.value != confirmPassword.current.value) {
			return setError('Password and confirm password must match');
		}
	}

	function sendData() {
		axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/update/account`, {
			password: data.password
		}, {
			withCredentials: true
		}).then((res) => {
			if (res.status == 200) {
				router.reload();
			}
		});
	}

	function renderLogin() {
		if (data.strategy == 'Local') {
			return (<div className='flex flex-col w-fit gap-1'>
				<label htmlFor='DisplayName' className='text-sm font-medium text-gray-800'>Email</label>
				<input type='text' defaultValue={data.email} className='border border-gray-200 rounded-md px-4 py-1 text-gray-400 cursor-no-drop' disabled />
			</div>);
		}

		if (data.strategy == 'Google') {
			return (<div className='flex flex-col w-fit gap-1'>
				<div className='border border-gray-500 text-gray-700 py-2 px-5 rounded'><FontAwesomeIcon icon={faGoogle} className='mr-2' /> You are signed in via Google</div>
			</div>);
		}

		if (data.strategy == 'Facebook') {
			return (<div className='flex flex-col w-fit gap-1'>
				<div className='border border-gray-500 text-gray-700 py-2 px-5 rounded'><FontAwesomeIcon icon={faSquareFacebook} className='mr-2' /> You are signed in via Facebook</div>
			</div>);
		}
	}

	return (
		<div>
			<div className='text-gray-800 font-bold text-2xl'>Account</div>
			<div className='text-gray-500'>The data one this page is sensitive, make sure you do not change things by accident</div>
			<div className='flex flex-col gap-7 py-5'>
				{renderLogin()}
				<div className='flex flex-col w-fit gap-1'>
					<div className='text-gray-800 font-bold text-lg'>Change password</div>
					<label htmlFor='Description' className='text-sm font-medium text-gray-800'>New password</label>
					<input type='password' className='border border-gray-300 rounded-md px-4 py-1' ref={newPassword} onChange={changeData} />
					<label htmlFor='Label' className='text-sm font-medium text-gray-800'>Confirm password</label>
					<input type='password' className='border border-gray-300 rounded-md px-4 py-1' ref={confirmPassword} onChange={changeData} />
					<div className='text-sm text-red-500'>{error}</div>
					<div>{data.password}</div>
				</div>

				<div className='flex flex-col w-fit gap-1'>

				</div>

				<div>
					{changed ? <button className='float-right bg-blue-500 text-white py-2 px-5 rounded' onClick={sendData}>Update</button> : <button className='float-right bg-blue-400 text-white py-2 px-5 rounded' disabled>Update</button>}
				</div>
			</div>
		</div>
	);
}
