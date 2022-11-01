import { Dialog } from '@headlessui/react';
import axios from 'axios';
import React, { FormEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hidePostModal, selectShowPost } from '../redux/modalsSlice';

export default function PostModal() {
	const titleRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);
	const showPost = useSelector(selectShowPost);
	const dispatch = useDispatch();

	function handleSubmission(e: FormEvent) {
		e.preventDefault();

		if (titleRef.current && descriptionRef.current) {
			axios
				.post(
					`${process.env.REACT_APP_API_URL}/api/create_post`,
					{
						title: titleRef.current.value,
						description: descriptionRef.current.value,
					},
					{
						withCredentials: true,
					}
				)
				.then((res) => {
					console.log(res);
				});
		}
	}

	return (
		<Dialog
			open={showPost}
			onClose={() => dispatch(hidePostModal())}
			className='inset-center border-gray-300 border p-4 rounded-md w-96'
		>
			<Dialog.Panel>
				<Dialog.Title className='text-xl font-semibold mb-2 text-gray-900'>
					Create a post
				</Dialog.Title>
				<Dialog.Description className='text-gray-600 mb-8'>
					Provide us with the title and description of the post
				</Dialog.Description>

				<form onSubmit={(e) => handleSubmission(e)}>
					<div>Title:</div>
					<input
						type='text'
						className='border border-gray-300 rounded px-4 py-1 my-2 w-full'
						required
						ref={titleRef}
					/>
					<div className='mt-8'>Description:</div>
					<textarea
						name=''
						className='border border-gray-300 rounded px-4 py-1 my-2 w-full resize-none'
						cols={30}
						rows={4}
						required
						ref={descriptionRef}
					></textarea>

					<button
						className='bg-blue-500 text-white py-2 px-4 rounded'
						type='submit'
					>
						Submit
					</button>
					<button
						className='bg-gray-300 py-2 px-4 rounded'
						onClick={() => dispatch(hidePostModal())}
					>
						Cancel
					</button>
				</form>
			</Dialog.Panel>
		</Dialog>
	);
}
