import { faGoogle, faSquareFacebook } from '@fortawesome/free-brands-svg-icons';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUserEmail, updateUserAccount } from '../../api/userApi';
import Button from '../Button';

export default function Account() {
	const [changed, setChanged] = useState(false);
	const [error, setError] = useState('');
	const [data, setData] = useState({
		email: '',
		strategy: '',
		password: '',
	});
	const [toastId, setToastId] = useState<string>('');
	const confirmPassword = useRef<HTMLInputElement>(null);
	const newPassword = useRef<HTMLInputElement>(null);
	const queryClient = useQueryClient();
	const updateMutation = useMutation('update_account', updateUserAccount, {
		onSuccess() {
			queryClient.invalidateQueries();
			setChanged(false);
			toast.success(
				'Your profile information has been updated successfully'
			);
			toast.dismiss(toastId);
		},
		onError: () => {
			toast.error('Failed to update your account information');
		},
	});

	useQuery('get_email', getUserEmail, {
		onSuccess: (apiData) => {
			setData({
				...data,
				...apiData,
			});
		},
		onError() {
			toast.error('Failed to fetch login strategy');
		},
	});

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

	function changeData() {
		if (!newPassword.current || !confirmPassword.current) {
			return;
		}

		if (
			newPassword.current.value === confirmPassword.current.value &&
			newPassword.current.value.length >= 8
		) {
			setError('');
			setChanged(true);
			return setData({
				...data,
				password: newPassword.current.value,
			});
		}

		setChanged(false);

		if (newPassword.current.value.length == 0) {
			return setError('');
		}

		if (newPassword.current.value.length < 8) {
			return setError('Password must be 8 or more characters long');
		}

		if (newPassword.current.value != confirmPassword.current.value) {
			return setError('Password and confirm password must match');
		}
	}

	function renderLogin() {
		if (data.strategy == 'Local') {
			return (
				<div className='flex flex-col w-fit gap-1'>
					<label
						htmlFor='DisplayName'
						className='text-sm font-medium text-gray-800'
					>
						Email
					</label>
					<input
						type='text'
						defaultValue={data.email}
						className='border border-gray-200 rounded-md px-4 py-1 text-gray-400 cursor-no-drop'
						disabled
					/>
				</div>
			);
		}

		if (data.strategy == 'Google') {
			return (
				<div className='flex flex-col w-fit gap-1'>
					<div className='border border-gray-500 text-gray-700 py-2 px-5 rounded'>
						<FontAwesomeIcon icon={faGoogle} className='mr-2' /> You
						are signed in via Google
					</div>
				</div>
			);
		}

		if (data.strategy == 'Facebook') {
			return (
				<div className='flex flex-col w-fit gap-1'>
					<div className='border border-gray-500 text-gray-700 py-2 px-5 rounded'>
						<FontAwesomeIcon
							icon={faSquareFacebook}
							className='mr-2'
						/>{' '}
						You are signed in via Facebook
					</div>
				</div>
			);
		}
	}

	return (
		<div>
			<div className='text-gray-800 font-bold text-2xl'>Account</div>
			<div className='text-gray-500'>
				The data one this page is sensitive, make sure you do not change
				things by accident
			</div>
			<div className='flex flex-col gap-7 py-5'>
				{renderLogin()}
				<div className='flex flex-col w-fit gap-1'>
					<div className='text-gray-800 font-bold text-lg'>
						Change password
					</div>
					<label
						htmlFor='Description'
						className='text-sm font-medium text-gray-800'
					>
						New password
					</label>
					<input
						type='password'
						className='border border-gray-300 rounded-md px-4 py-1'
						ref={newPassword}
						onChange={changeData}
					/>
					<label
						htmlFor='Label'
						className='text-sm font-medium text-gray-800'
					>
						Confirm password
					</label>
					<input
						type='password'
						className='border border-gray-300 rounded-md px-4 py-1'
						ref={confirmPassword}
						onChange={changeData}
					/>
					<div className='text-sm text-red-500'>{error}</div>
					<div>{data.password}</div>
				</div>

				<div className='flex flex-col w-fit gap-1'></div>

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
