import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { selectAvatar, selectBackground, selectDescription, selectDisplayName, selectIsPrivate, selectLabel } from '../../redux/userSlice';
import Toggle from '../Toggle';

export default function Settings() {
	const defaultData = {
		avatar: useSelector(selectAvatar),
		background: useSelector(selectBackground),
		displayName: useSelector(selectDisplayName),
		description: useSelector(selectDescription),
		label: useSelector(selectLabel),
		isPrivate: useSelector(selectIsPrivate),
	};
	const router = useRouter();
	const [data, setData] = useState(defaultData);
	const [changed, setChanged] = useState(false);

	useEffect(() => {
		for (let i = 0; i < Object.values(defaultData).length; i++) {
			if (Object.values(defaultData)[i] != Object.values(data)[i]) {
				return setChanged(true);
			}
		}

		return setChanged(false);
	}, [data]);

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

	function changeData(e: unknown, property: keyof typeof defaultData) {
		setData({
			...data,
			[property]: e
		});
	}

	function sendData() {
		axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/update/profile`, data, {
			withCredentials: true
		})
			.then((res) => {
				if (res.status == 200) {
					router.reload();
				}
			});
	}

	return (
		<div>
			<div className='text-gray-800 font-bold text-2xl'>Profile</div>
			<div className='text-gray-500'>This information will be displayed publicly so be careful what you share</div>
			<div className='flex flex-col gap-7 py-5'>
				<div className='flex flex-col w-28 gap-3'>
					<img src={defaultData.avatar} className='w-28 rounded-full' />
					<button className='border border-gray-200 py-1 px-3 w-fit rounded'>Upload</button>
				</div>

				<div className='flex flex-col w-fit gap-3'>
					<img src={defaultData.background} className='h-24 rounded-md' />
					<button className='border border-gray-200 py-1 px-3 w-fit rounded'>Upload</button>
				</div>

				<div className='flex flex-col w-fit gap-1'>
					<label htmlFor='DisplayName' className='text-sm font-medium text-gray-800'>Display Name</label>
					<input type='text' defaultValue={defaultData.displayName} className='border border-gray-300 rounded-md px-4 py-1' onChange={(e) => changeData(e.target.value, 'displayName')} />
				</div>

				<div className='flex flex-col w-fit gap-1'>
					<label htmlFor='Description' className='text-sm font-medium text-gray-800'>Description</label>
					<textarea defaultValue={defaultData.description} className='border border-gray-300 rounded-md px-4 py-1 resize-none' onChange={(e) => changeData(e.target.value, 'description')}
						cols={50}
						rows={6} />
				</div>

				<div className='flex flex-col w-fit gap-1'>
					<label htmlFor='Label' className='text-sm font-medium text-gray-800'>Label</label>
					<input type='text' defaultValue={defaultData.label} className='border border-gray-300 rounded-md px-4 py-1' onChange={(e) => changeData(e.target.value, 'label')} />
				</div>

				<div className='flex flex-col w-fit gap-1'>
					<label htmlFor='Label' className='text-sm font-medium text-gray-800'>Private account</label>
					<Toggle defaultEnabled={defaultData.isPrivate} onChange={(e) => changeData(e, 'isPrivate')} />
				</div>

				<div>
					{changed ? <button className='float-right bg-blue-500 text-white py-2 px-5 rounded' onClick={sendData}>Update</button> : <button className='float-right bg-blue-400 text-white py-2 px-5 rounded' disabled>Update</button>}
				</div>
			</div>
		</div>
	);
} 