import React, { ChangeEvent, useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAvatar, selectBackground, selectDescription, selectDisplayName, selectLabel } from '../../redux/userSlice';

export default function Settings() {
	const defaultData = {
		avatar: useSelector(selectAvatar),
		background: useSelector(selectBackground),
		displayName: useSelector(selectDisplayName),
		description: useSelector(selectDescription),
		label: useSelector(selectLabel),
	};

	const [data, setData] = useState(defaultData);

	const [changed, setChanged] = useState(false);

	useEffect(() => {
		console.log(changed);
		for (let i = 0; i < Object.values(defaultData).length; i++) {
			if (Object.values(defaultData)[i] != Object.values(data)[i]) {
				return setChanged(true);
			}
		}

		return setChanged(false);
	}, [data]);

	function changeData(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, property: keyof typeof defaultData) {
		setData({
			...data,
			[property]: e.target.value
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
					<input type='text' defaultValue={defaultData.displayName} className='border border-gray-300 rounded-md px-4 py-1' onChange={(e) => changeData(e, 'displayName')} />
				</div>

				<div className='flex flex-col w-fit gap-1'>
					<label htmlFor='Description' className='text-sm font-medium text-gray-800'>Description</label>
					<textarea defaultValue={defaultData.description} className='border border-gray-300 rounded-md px-4 py-1 resize-none' onChange={(e) => changeData(e, 'description')}
						cols={50}
						rows={6} />
				</div>

				<div className='flex flex-col w-fit gap-1'>
					<label htmlFor='Label' className='text-sm font-medium text-gray-800'>Label</label>
					<input type='text' defaultValue={defaultData.label} className='border border-gray-300 rounded-md px-4 py-1' onChange={(e) => changeData(e, 'label')} />
				</div>

				<div>
					{changed ? <button className='float-right bg-blue-500 text-white py-2 px-5 rounded'>Update</button> : <button className='float-right bg-blue-400 text-white py-2 px-5 rounded' disabled>Update</button>}
				</div>
			</div>
		</div>
	);
} 