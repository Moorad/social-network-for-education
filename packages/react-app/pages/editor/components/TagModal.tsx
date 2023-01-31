import React, { useEffect, useState } from 'react';
import Modal from '../../../components/Modal';

export default function TagModal({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
}) {
	const [popularTags, setPopularTags] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	useEffect(() => {
		setPopularTags([
			'Food',
			'Football',
			'Memes',
			'Computer_science',
			'World_cup',
			'Pizza',
			'Nature',
			'Holiday',
			'Cute',
			'Animal',
			'Family',
		]);
	}, []);

	return (
		<Modal
			title='Set tags'
			description='We highly encourage setting multiple tags on your post as it helps the platform more accurately recommend your post'
			isOpen={isOpen}
			setIsOpen={() => setIsOpen(false)}
		>
			<div>
				<div>
					<div className='mb-3'>Popular tags</div>
					<div className='flex gap-3 flex-wrap mb-3'>
						{popularTags.map((e, i) => (
							<button
								key={i}
								className='bg-gray-200 text-gray-700 px-3 py-1 rounded-sm cursor-pointer'
								onClick={() => {
									if (!selectedTags.some((elm) => elm == e)) {
										setSelectedTags([...selectedTags, e]);
									}
								}}
							>
								{e}
							</button>
						))}
					</div>
				</div>
				<div>
					<input
						type='text'
						placeholder='Search/Add new tag'
						className='border border-gray-300 rounded-md px-4 py-1 my-1 w-full'
					/>
				</div>
				<div>
					<div className='mt-3 mb-1'>
						Selected tags{' '}
						<span className='text-xs bg-blue-500 text-white px-2 rounded-full'>
							{selectedTags.length}
						</span>
					</div>
					<div className='flex gap-3 overflow-x-auto py-2 mb-3'>
						{selectedTags.length == 0 && (
							<div className='text-gray-500 bg-gray-200 w-full py-2 px-4'>
								No selected tags
							</div>
						)}
						{selectedTags.map((e, i) => (
							<div
								key={i}
								className='bg-blue-500 text-white px-3 py-1 rounded-sm cursor-pointer'
							>
								{e}
							</div>
						))}
					</div>
				</div>

				<div className='flex gap-5 mt-6 text-sm'>
					<button
						className='bg-gray-400 py-2 px-5 rounded text-white'
						onClick={() => setIsOpen(false)}
					>
						Close
					</button>
				</div>
			</div>
		</Modal>
	);
}
