import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import Modal from '../../../components/Modal';
import { cleanStringAndCase } from '../../../utils/text';

const suggestedTags = [
	'Food',
	'Article',
	'Personal',
	'Computer_Science',
	'Travel',
	'Software',
	'Useful',
	'Technical',
	'Statement',
	'Finance',
	'Family',
	'Sport',
	'Hobby',
	'Technology',
	'Innovation',
];

export default function TagModal({
	isOpen,
	setIsOpen,
	tags,
	setTags,
}: {
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
	tags: string[];
	setTags: (tags: string[]) => void;
}) {
	const tagInputRef = useRef<HTMLInputElement>(null);

	return (
		<Modal
			title='Set tags'
			description='We highly encourage setting multiple tags on your post as it helps the platform more accurately recommend your post'
			isOpen={isOpen}
			setIsOpen={() => setIsOpen(false)}
		>
			<div>
				<div>
					<div className='mb-3'>Suggested tags</div>
					<div className='flex gap-3 flex-wrap mb-3'>
						{suggestedTags.map((e, i) => (
							<button
								key={i}
								className={
									'text-gray-700 px-3 py-1 rounded-sm cursor-pointer ' +
									(tags.some((elm) => elm == e)
										? 'bg-blue-500 text-white'
										: 'bg-gray-200')
								}
								onClick={() => {
									if (tags.some((elm) => elm == e)) {
										setTags(tags.filter((tag) => tag == e));
									} else {
										setTags([...tags, e]);
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
						ref={tagInputRef}
						onKeyDownCapture={(evt) => {
							if (
								!tagInputRef.current ||
								tagInputRef.current.value == ''
							) {
								return;
							}

							if (evt.key === 'Enter') {
								const inputText = cleanStringAndCase(
									tagInputRef.current.value
								);
								if (!tags.some((elm) => elm == inputText)) {
									setTags([...tags, inputText]);
								}

								tagInputRef.current.value = '';
							}
						}}
					/>
				</div>
				<div>
					<div className='mt-3 mb-1'>
						Selected tags{' '}
						<span className='text-xs bg-blue-500 text-white px-2 rounded-full'>
							{tags.length}
						</span>
					</div>
					<div className='flex gap-3 overflow-x-auto py-2 mb-3'>
						{selectedTags.length == 0 && (
							<div className='text-gray-500 bg-gray-200 w-full py-2 px-4'>
								No selected tags
							</div>
						)}
						{selectedTags.map((e, i) => (
							<button
								className='flex bg-blue-500 text-white rounded-sm cursor-pointer py-1'
								key={i}
							>
								<span
									className=' pl-2 text-white opacity-50 hover:opacity-100'
									onClick={() => {
										setTags([...tags, e]);
									}}
								>
									<FontAwesomeIcon icon={faXmarkCircle} />
								</span>
								<span className='px-2'>{e}</span>
							</button>
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
