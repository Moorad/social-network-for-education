import { Combobox } from '@headlessui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import router from 'next/router';

type responseResult = {
	displayName: string;
	_id: string;
	avatar: string;
};

export default function GeneralSearchBar() {
	const [query, setQuery] = useState('');
	const [selected, setSelected] = useState<responseResult>();
	const [users, setUsers] = useState<responseResult[]>([]);

	useEffect(() => {
		if (query != '') {
			axios
				.get(
					`${process.env.NEXT_PUBLIC_API_URL}/utils/search?term=${query}`,
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
			router.push(`/user/${selected?._id}`);
		}
	}, [selected]);

	return (
		<Combobox value={selected} onChange={setSelected}>
			{({ open }) => (
				<>
					<Combobox.Input
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Search'
						className='placeholder:text-gray-500 py-2.5 px-5 border-gray-300 border rounded-md w-full mb-2'
						autoComplete='off'
					/>
					{open && (
						<div className='w-full relative'>
							<Combobox.Options
								className='rounded-md border-gray-300 border absolute py-1 w-full'
								static
							>
								{users.length == 0 && (
									<div className='px-5 py-2 text-gray-400 text-md'>
										Nothing found.
									</div>
								)}
								{users.map((item) => (
									<Combobox.Option
										key={item.displayName}
										value={item}
										className='px-5 py-2 hover:bg-gray-200 w-full'
									>
										<img
											src={item.avatar}
											className='w-6 aspect-square inline mr-3 rounded-full'
										/>
										{item.displayName}
									</Combobox.Option>
								))}
							</Combobox.Options>
						</div>
					)}
				</>
			)}
		</Combobox>
	);
}
