import { faBold } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { createPost } from '../../api/postApi';
import Loading from '../../components/Loading';
import MainNavBar from '../../components/NavBars/MainNavBar';
import useAuth from '../../utils/hooks/useAuth';
import ToolbarItem from './components/ToolbarItem';

export default function PostEditor() {
	const { fetching, user } = useAuth();
	const router = useRouter();
	const titleRef = useRef<HTMLInputElement>(null);
	const descriptionRef = useRef<HTMLTextAreaElement>(null);
	const queryClient = useQueryClient();

	const postMutation = useMutation('create_post', createPost, {
		onSuccess: () => {
			queryClient.invalidateQueries();
			router.push('/profile');
		},
		onError: () => {
			toast.error('Failed to create a new post');
		}
	});

	function handleSubmission() {
		if (titleRef.current && descriptionRef.current) {
			postMutation.mutate({
				title: titleRef.current.value,
				description: descriptionRef.current.value
			});
		}
	}

	if (fetching) {
		return <Loading />;
	}

	return (
		<MainNavBar>
			<div className='w-4/5 h-full mx-auto p-5 flex flex-col'>
				<div className='flex items-center gap-4'>
					<img src={user?.avatar} className='w-9 rounded-full' />
					<div className='text-gray-700 font-medium text-lg'>{user?.displayName}</div>
				</div>
				<div className='text-4xl font-bold text-gray-900 my-1'>
					<input type='text' placeholder='New post title here...' className='py-4 w-full outline-0' ref={titleRef} />
				</div>
				<div className='my-4'>
					<ToolbarItem icon={faBold} />
				</div>
				<div className='flex-grow text-lg'>
					<textarea className='w-full h-full outline-0 resize-none' placeholder='Text description...' ref={descriptionRef}></textarea>
				</div>
				<div className='flex gap-5 my-5 flex-row-reverse'>
					<button className='bg-blue-500 py-2 px-5 rounded text-white' onClick={handleSubmission}>Post</button>
					<button className='bg-red-500 py-2 px-5 rounded text-white'>Discard</button>
				</div>
			</div>
		</MainNavBar>
	);
}
