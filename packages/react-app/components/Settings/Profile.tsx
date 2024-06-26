import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUserMe, updateUserProfile } from '../../api/userApi';
import Button from '../Button';
import Toggle from '../Toggle';

export default function Settings() {
	const { data: defaultData } = useQuery('user_me', getUserMe, {
		onError() {
			toast.error('Failed to fetch profile information');
		},
	});
	const [data, setData] = useState(defaultData);
	const [changed, setChanged] = useState(false);
	const queryClient = useQueryClient();
	const [toastId, setToastId] = useState<string>('');
	const updateMutation = useMutation('update_profile', updateUserProfile, {
		onSuccess: () => {
			queryClient.invalidateQueries();
			setChanged(false);
			toast.success(
				'Your profile information has been updated successfully'
			);
			toast.dismiss(toastId);
		},
		onError: () => {
			toast.error('Failed to update your profile information');
		},
	});

	useEffect(() => {
		for (let i = 0; i < Object.values(defaultData).length; i++) {
			if (Object.values(defaultData)[i] != Object.values(data)[i]) {
				return setChanged(true);
			}
		}

		return setChanged(false);
	}, [data]);

	useEffect(() => {
		if (changed) {
			setToastId(
				toast('You have unsaved changes', {
					icon: (
						<FontAwesomeIcon
							icon={faExclamationCircle}
							className='text-yellow-600'
						/>
					),
					position: 'bottom-center',
					duration: Infinity,
				})
			);
		} else {
			toast.dismiss(toastId);
		}
	}, [changed]);

	function changeData(e: unknown, property: keyof typeof defaultData) {
		setData({
			...data,
			[property]: e,
		});
	}

	return (
		<div>
			<div className='text-gray-800 font-bold text-2xl'>Profile</div>
			<div className='text-gray-500'>
				This information will be displayed publicly so be careful what
				you share
			</div>
			<div className='flex flex-col gap-7 py-5'>
				<div className='flex flex-col w-28 gap-3'>
					<img
						src={defaultData.avatar}
						className='w-28 rounded-full'
					/>
					<Button>Upload</Button>
				</div>

				<div className='flex flex-col w-fit gap-3'>
					<img
						src={defaultData.background}
						className='h-24 rounded-md'
					/>
					<Button>Upload</Button>
				</div>

				<div className='flex flex-col w-fit gap-1'>
					<label
						htmlFor='DisplayName'
						className='text-sm font-medium text-gray-800'
					>
						Display Name
					</label>
					<input
						type='text'
						defaultValue={defaultData.displayName}
						className='border border-gray-300 rounded-md px-4 py-1'
						onChange={(e) =>
							changeData(e.target.value, 'displayName')
						}
					/>
				</div>

				<div className='flex flex-col w-fit gap-1'>
					<label
						htmlFor='Description'
						className='text-sm font-medium text-gray-800'
					>
						Description
					</label>
					<textarea
						defaultValue={defaultData.description}
						className='border border-gray-300 rounded-md px-4 py-1 resize-none'
						onChange={(e) =>
							changeData(e.target.value, 'description')
						}
						cols={50}
						rows={6}
					/>
				</div>

				<div className='flex flex-col w-fit gap-1'>
					<label
						htmlFor='Label'
						className='text-sm font-medium text-gray-800'
					>
						Label
					</label>
					<input
						type='text'
						defaultValue={defaultData.label}
						className='border border-gray-300 rounded-md px-4 py-1'
						onChange={(e) => changeData(e.target.value, 'label')}
					/>
				</div>

				<div className='flex flex-col w-fit gap-1'>
					<label
						htmlFor='Label'
						className='text-sm font-medium text-gray-800'
					>
						Private account
					</label>
					<Toggle
						defaultEnabled={defaultData.isPrivate}
						onChange={(e) => changeData(e, 'isPrivate')}
					/>
				</div>

				<div>
					<Button
						additionalClasses='float-right'
						disabled={!changed}
						variant='primary'
						onClick={() => {
							updateMutation.mutate(data);
						}}
					>
						Update
					</Button>
				</div>
			</div>
		</div>
	);
}
