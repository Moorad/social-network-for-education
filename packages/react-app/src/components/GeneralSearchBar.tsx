import { Combobox } from '@headlessui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type responseResult = {
	displayName: string;
	_id: string;
	avatar: string;
};

export default function GeneralSearchBar() {
	const [query, setQuery] = useState('');
	const [selected, setSelected] = useState<responseResult>();
	const [users, setUsers] = useState<responseResult[]>([]);

	const navigate = useNavigate();

	useEffect(() => {
		if (query != '') {
			axios
				.get(
					`${process.env.REACT_APP_API_URL}/api/search?term=${query}`,
					{
						withCredentials: true,
					}
				)
				.then((res) => {
					setUsers(res.data.results);
				});
		}
	}, [query]);

	useEffect(() => {
		if (selected != undefined) {
			navigate(`/user/${selected?._id}`);
		}
	}, [selected]);

	return (
		<Combobox value={selected} onChange={setSelected}>
			<Combobox.Input
				onChange={(e) => setQuery(e.target.value)}
				placeholder='Search'
				className='placeholder:text-gray-500 py-2.5 px-5 border-gray-300 border rounded-md w-full mb-2'
				autoComplete='off'
			/>
			<div className='w-full relative'>
				<Combobox.Options className='rounded-md border-gray-300 border py-1 absolute w-full'>
					{users.map((item) => (
						<Combobox.Option
							key={item.displayName}
							value={item}
							className='px-5 py-2 hover:bg-gray-200 w-full'
						>
							<img
								src={item.avatar}
								className='w-6 inline mr-3 rounded-full'
							/>
							{item.displayName}
						</Combobox.Option>
					))}
				</Combobox.Options>
			</div>
		</Combobox>
	);
}