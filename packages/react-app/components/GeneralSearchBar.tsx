import { Combobox } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import router from 'next/router';
import { searchQuery } from '../api/utilsApi';
import useDebounce from '../utils/hooks/useDebounce';
import { useQuery } from 'react-query';
import type { UserType } from 'node-server/Models/User';
import EmptyMessage from './EmptyMessage';

type responseResult = {
	results: UserType[];
};

export default function GeneralSearchBar() {
	const [query, setQuery] = useState<string | undefined>(undefined);
	const [selected, setSelected] = useState<UserType>();
	const debouncedQuery = useDebounce(query || '', 500);
	const { data } = useQuery<responseResult>(
		['search', debouncedQuery],
		() => searchQuery(debouncedQuery),
		{
			enabled: Boolean(query),
		}
	);

	useEffect(() => {
		if (selected != undefined) {
			router.push(`/user/${selected._id}`);
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
								<EmptyMessage
									value={data?.results}
									message='No results found'
									background='bg-white'
								/>
								{data?.results.map((item) => (
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
