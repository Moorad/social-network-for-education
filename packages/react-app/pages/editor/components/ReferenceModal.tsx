import {
	faFile,
	faTrash,
	faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Combobox } from '@headlessui/react';
import React, { useState } from 'react';
import Modal from '../../../components/Modal';
import useDebounce from '../../../utils/hooks/useDebounce';

type ReferenceType = {
	title: string;
	DOI: string;
	creation: string;
	authors: string[];
};

const references: ReferenceType[] = [
	{
		title: 'UNA NUEVA MIRADA A LAS PRÁCTICAS DE ACTIVIDADES DEPORTIVAS Y EL RENDIMIENTO ACADÉMICO. REFLEXIONES',
		DOI: 'http://dx.doi.org/10.35195/ob.v11i2.758',
		creation: '2019-05-03T15:09:48Z',
		authors: ['Laura Wilkinson', 'Laura Wilkinson'],
	},
	{
		title: 'Chapter 1 - An Introduction to Neural Networks and Deep Learning',
		DOI: 'http://dx.doi.org/10.35195/ob.v11i2.758',
		creation: '2019-05-03T15:09:48Z',
		authors: ['Laura Wilkinson'],
	},
	{
		title: 'On-the-fly (D)DoS attack mitigation in SDN using Deep Neural Network-based rate limiting',
		DOI: 'http://dx.doi.org/10.35195/ob.v11i2.758',
		creation: '2019-05-03T15:09:48Z',
		authors: ['Laura Wilkinson'],
	},
	{
		title: 'ZM-CTC: Covert timing channel construction method based on zigzag matrix',
		DOI: 'http://dx.doi.org/10.35195/ob.v11i2.758',
		creation: '2019-05-03T15:09:48Z',
		authors: ['Laura Wilkinson'],
	},
];

export default function ReferenceModal({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
}) {
	const [selectedRefs, setSelectedRefs] = useState<ReferenceType[]>([]);
	const [query, setQuery] = useState('');
	const debouncedQuery = useDebounce(query, 800);

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
						// value={selectedPerson}
						// onChange={setSelectedPerson}
					>
						<Combobox.Input
							className='border border-gray-300 rounded-md px-4 py-1 my-1 w-full'
							placeholder='DIO, title, author, etc'
							onChange={(event) => setQuery(event.target.value)}
						/>
						<Combobox.Options className='flex flex-col gap-5 bg-white rounded-md overflow-auto h-52 mt-2'>
							{references.map((ref, i) => (
								<Combobox.Option
									key={i}
									value={ref.title}
									className='bg-gray-100 hover:bg-gray-200 p-3 rounded-md cursor-pointer'
									onClick={() =>
										setSelectedRefs([
											...selectedRefs,
											references[i],
										])
									}
								>
									<div className='font-semibold'>
										{ref.title}
									</div>
									<div className='text-blue-500 underline'>
										<a href={ref.DOI}>{ref.DOI}</a>
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
										setSelectedRefs(
											selectedRefs.filter(
												(_, index) => index != i
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
			</div>
		</Modal>
	);
}
