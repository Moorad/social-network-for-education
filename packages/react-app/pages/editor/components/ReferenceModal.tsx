import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Combobox } from '@headlessui/react';
import { ReferenceType } from 'node-server/routes/utils';
import React, { useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { referenceQuery } from '../../../api/utilsApi';
import InlineLoading from '../../../components/InlineLoading';
import Modal from '../../../components/Modal';
import useDebounce from '../../../utils/hooks/useDebounce';
import EmptyMessage from '../../../components/EmptyMessage';
import Button from '../../../components/Button';

export default function ReferenceModal({
	isOpen,
	setIsOpen,
	references,
	setReferences,
}: {
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
	references: ReferenceType[];
	setReferences: (references: ReferenceType[]) => void;
}) {
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce(query, 800);
	const referenceMutation = useMutation('references', referenceQuery, {
		onSuccess: (res) => {
			setQueryResults(res.items);
		},
	});
	const [queryResults, setQueryResults] = useState<ReferenceType[]>([]);
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		setQueryResults([]);
		referenceMutation.mutate(debouncedQuery);
	}, [debouncedQuery]);

	return (
		<Modal
			title='Add References'
			description="References help user's verify the credibility of the facts presented in the post"
			isOpen={isOpen}
			setIsOpen={() => setIsOpen(false)}
		>
			<div>
				<div>
					<div className='mt-3 mb-1'>Lookup reference</div>
					<Combobox className='relative' as='div' value={null}>
						<Combobox.Input
							className='border border-gray-300 rounded-md px-4 py-1 my-1 w-full'
							placeholder='DIO, title, author, etc'
							ref={searchInputRef}
							onChange={(event) => setQuery(event.target.value)}
						/>
						<Combobox.Options className='flex flex-col gap-5 bg-white rounded-md overflow-auto max-h-52 mt-2'>
							{referenceMutation.isLoading && (
								<div>
									<InlineLoading />
								</div>
							)}

							{!referenceMutation.isLoading && (
								<EmptyMessage
									value={references}
									message={`No results found for '${debouncedQuery}'`}
								/>
							)}

							{queryResults.map((ref, i) => (
								<Combobox.Option
									key={i}
									value={ref.title}
									className='bg-gray-100 hover:bg-gray-200 p-3 rounded-md cursor-pointer'
									onClick={() => {
										setQueryResults([]);
										setReferences([...references, ref]);
									}}
								>
									<div className='font-semibold'>
										{ref.title}
									</div>
									<div className='text-blue-500 underline'>
										<a
											href={`https://doi.org/${ref.DOI}`}
											target='_blank'
											rel='noreferrer'
										>
											https://doi.org/{ref.DOI}
										</a>
									</div>
									<div className='flex flex-wrap justify-between'>
										<div>{ref.authors.join(', ')}</div>
										<div>
											{new Date(
												ref.creation
											).getFullYear()}
										</div>
									</div>
								</Combobox.Option>
							))}
						</Combobox.Options>
					</Combobox>
				</div>

				<div>
					<div className='mt-3 mb-1'>Selected references</div>
					<EmptyMessage
						value={references}
						message='No references selected'
					/>

					<div className='flex flex-col gap-3 bg-white rounded-md overflow-auto max-h-52 mt-2'>
						{references.map((ref, i) => (
							<button
								key={i}
								className='flex items-center justify-between p-3 rounded-md bg-blue-500 text-white cursor-default'
							>
								<div className='text-sm font-semibold text-left'>
									{ref.title}
								</div>
								<span
									className='p-3 cursor-pointer'
									onClick={() => {
										setReferences(
											references.filter(
												(_, index) => i != index
											)
										);
									}}
								>
									<FontAwesomeIcon icon={faTrash} />
								</span>
							</button>
						))}
					</div>
				</div>
				<div className='mt-6'>
					<Button size='small' onClick={() => setIsOpen(false)}>
						Close
					</Button>
				</div>
			</div>
		</Modal>
	);
}
