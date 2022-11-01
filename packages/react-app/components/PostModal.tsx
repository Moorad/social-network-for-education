import { Dialog } from '@headlessui/react';
import axios from 'axios';
import React, { FormEvent, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hidePostModal, selectShowPost } from '../redux/modalsSlice';
import { selectAvatar } from '../redux/userSlice';

export default function PostModal() {
	const titleRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);
	const showPost = useSelector(selectShowPost);
	const avatar = useSelector(selectAvatar);
	const dispatch = useDispatch();

	function handleSubmission(e: FormEvent) {
		e.preventDefault();

		if (titleRef.current && descriptionRef.current) {
			axios
				.post(
					`${process.env.NEXT_PUBLIC_API_URL}/api/create_post`,
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
			className='relative'
		>
			<div className='fixed inset-0 bg-black/20' aria-hidden='true' />

			<div className='fixed inset-0'>
				<Dialog.Panel className='absolute inset-center border-gray-300 border p-8 rounded-md w-[38rem] bg-white'>
					<Dialog.Title className='text-3xl font-bold mb-2 text-gray-900'>
						Create a post
					</Dialog.Title>
					<Dialog.Description className='text-gray-600 mb-2'>
						<img
							src={avatar}
							className='w-14 aspect-square rounded-full'
						/>
					</Dialog.Description>

					<form onSubmit={(e) => handleSubmission(e)}>
						<div className='mb-4'>
							<input
								type='text'
								className='border border-gray-300 rounded px-4 py-1 my-2 w-full'
								required
								ref={titleRef}
								placeholder='Title'
							/>
							<textarea
								placeholder='Text'
								className='border border-gray-300 rounded px-4 py-1 my-2 w-full resize-none'
								cols={30}
								rows={4}
								required
								ref={descriptionRef}
							></textarea>
						</div>

						<div className='flex flex-row-reverse gap-5 text-sm'>
							<button
								className='bg-blue-500 text-white py-2 px-5 rounded'
								type='submit'
							>
								Submit
							</button>
							<button
								className='bg-gray-400 py-2 px-5 rounded text-white'
								onClick={() => dispatch(hidePostModal())}
							>
								Cancel
							</button>
						</div>
					</form>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}
