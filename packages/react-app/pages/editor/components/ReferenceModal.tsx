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

export default function ReferenceModal({
	isOpen,
	setIsOpen,
	pushRef,
	removeRef,
}: {
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
	pushRef: (ref: ReferenceType) => void;
	removeRef: (index: number) => void;
}) {
	const [selectedRefs, setSelectedRefs] = useState<ReferenceType[]>([]);
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce(query, 800);
	const referenceMutation = useMutation('references', referenceQuery, {
		onSuccess: (res) => {
			setQueryResults(res.items);
		},
	});
	const [queryResults, setQueryResults] = useState<ReferenceType[]>([]);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const comboBoxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setQueryResults([]);
		referenceMutation.mutate(debouncedQuery);
	}, [debouncedQuery]);

	function localPushRef(ref: ReferenceType) {
		setSelectedRefs([...selectedRefs, ref]);

		pushRef(ref);
	}

	function localRemoveRef(index: number) {
		setSelectedRefs(selectedRefs.filter((_, i) => index != i));

		removeRef(index);
	}

	return (
		<Modal
			title='Add References'
			isOpen={isOpen}
			setIsOpen={() => setIsOpen(false)}
		>
			<div>
				<div>
					<div className='mt-3 mb-1'>Lookup reference</div>
					<Combobox
						className='relative'
						as='div'
						ref={comboBoxRef}
						value={null}
					>
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

							{!referenceMutation.isLoading &&
								queryResults.length == 0 && (
									<div className='bg-gray-100 text-gray-500 p-4 items-center text-center gap-4 rounded-md text-md'>
										No references found for the term &apos;
										{debouncedQuery}&apos;
									</div>
								)}

							{queryResults.map((ref, i) => (
								<Combobox.Option
									key={i}
									value={ref.title}
									className='bg-gray-100 hover:bg-gray-200 p-3 rounded-md cursor-pointer'
									onClick={() => {
										setQueryResults([]);
										localPushRef(ref);
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
					{selectedRefs.length == 0 && (
						<div className='bg-gray-100 text-gray-500 p-4 items-center text-center gap-4 rounded-md text-md'>
							No references selected
						</div>
					)}

					<div className='flex flex-col gap-3 bg-white rounded-md overflow-auto max-h-52 mt-2'>
						{selectedRefs.map((ref, i) => (
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
										localRemoveRef(i);
									}}
								>
									<FontAwesomeIcon icon={faTrash} />
								</span>
							</button>
						))}
					</div>
				</div>
			</div>
		</Modal>
	);
}
