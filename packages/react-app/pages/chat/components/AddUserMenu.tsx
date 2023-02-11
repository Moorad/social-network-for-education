import { Combobox } from '@headlessui/react';
import { UserMinimal } from 'node-server/Models/User';
import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { createChatRequest } from '../../../api/chatApi';
import { searchQuery } from '../../../api/utilsApi';
import useDebounce from '../../../utils/hooks/useDebounce';

export default function AddUserMenu() {
	const [query, setQuery] = useState('');
	const [results, setResults] = useState<UserMinimal[]>([]);
	const debouncedQuery = useDebounce(query, 500);
	const queryClient = useQueryClient();
	const searchMutation = useMutation<{
		results: UserMinimal[];
	}>(['search', debouncedQuery], () => searchQuery(debouncedQuery), {
		onSuccess: (res) => {
			console.log(res);
			setResults(res.results);
		},
	});
	const createChatMutation = useMutation('create_chat', createChatRequest, {
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
	});

	useEffect(() => {
		searchMutation.mutate();
	}, [debouncedQuery]);

	function createChat(userId: string) {
		createChatMutation.mutate(userId);
	}

	return (
		<Combobox value={null} onChange={createChat}>
			<Combobox.Input
				className=' border border-gray-300 px-2 py-1 text-sm w-full rounded-sm'
				type='text'
				placeholder='Add new people'
				onChange={(event) => setQuery(event.target.value)}
			/>
			<div className='relative w-full h-3'>
				<Combobox.Options className='border-gray-300 border bg-white absolute py-1 w-full rounded-sm'>
					{results.map((person, i) => (
						<Combobox.Option
							className='px-5 py-2 hover:bg-gray-200 w-full cursor-pointer'
							key={i}
							value={person._id}
						>
							<img
								src={person.avatar}
								className='w-6 aspect-square inline mr-3 rounded-full'
							/>
							{person.displayName}
						</Combobox.Option>
					))}
				</Combobox.Options>
			</div>
		</Combobox>
	);
}
