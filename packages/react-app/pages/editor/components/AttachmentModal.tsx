import {
	faClose,
	faFile,
	faFileExcel,
	faFileImage,
	faFilePdf,
	faFilePowerpoint,
	faFileWord,
	faFileZipper,
	IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from 'react-query';
import { AttachmentType } from '..';
import { uploadAnyFile } from '../../../api/userApi';
import { formatByteSizes } from '../../../utils/format';

export default function AttachmentModal({
	open,
	close,
	pushAttachmentURL,
	removeAttachmentURL,
}: {
	open: boolean;
	close: () => void;
	pushAttachmentURL: (att: AttachmentType) => void;
	removeAttachmentURL: (index: number) => void;
}) {
	const [attachments, setAttachments] = useState<AttachmentType[]>([]);
	const fileRef = useRef<HTMLInputElement>(null);
	const uploadMutation = useMutation(uploadAnyFile, {
		onSuccess: (res) => {
			setAttachments([
				...attachments,
				{
					name: res.name,
					mime: res.mime,
					size: res.size,
					url: res.url,
				},
			]);
			toast.success('Uploaded sucessfully');
		},
		onError: () => {
			toast.error('Failed to upload image');
		},
	});

	useEffect(() => {
		if (attachments.length > 0) {
			pushAttachmentURL(attachments[attachments.length - 1]);
		}
	}, [attachments]);

	function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			const imageFile = e.target.files[0];

			const formData = new FormData();

			formData.append('file', imageFile);

			uploadMutation.mutate({
				formData: formData,
			});
		}
	}

	function removeAttachment(index: number) {
		setAttachments(attachments.filter((_, i) => i != index));

		removeAttachmentURL(index);
	}

	function getIconFromMimeType(mimeType: string) {
		let icon: IconDefinition;
		let iconColor: string;
		switch (mimeType) {
			case 'application/msword':
				icon = faFileWord;
				iconColor = 'text-blue-500';
				break;
			case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
				icon = faFileWord;
				iconColor = 'text-blue-500';
				break;
			case 'application/vnd.ms-powerpoint':
				icon = faFilePowerpoint;
				iconColor = 'text-orange-600';
				break;
			case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
				icon = faFilePowerpoint;
				iconColor = 'text-orange-600';
				break;
			case 'application/vnd.ms-excel':
				icon = faFileExcel;
				iconColor = 'text-emerald-600';
				break;
			case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
				icon = faFileExcel;
				iconColor = 'text-emerald-600';
				break;
			case 'application/zip':
				icon = faFileZipper;
				iconColor = 'text-amber-400';
				break;
			case 'application/x-zip-compressed':
				icon = faFileZipper;
				iconColor = 'text-amber-400';
				break;
			case 'application/pdf':
				icon = faFilePdf;
				iconColor = 'text-red-500';
				break;
			case 'image/jpeg':
				icon = faFileImage;
				iconColor = 'text-emerald-600';
				break;
			case 'image/png':
				icon = faFileImage;
				iconColor = 'text-emerald-600';
				break;
			default:
				icon = faFile;
				iconColor = 'text-gray-700';
				break;
		}

		return (
			<FontAwesomeIcon icon={icon} className={'text-3xl ' + iconColor} />
		);
	}

	return (
		<Dialog open={open} onClose={() => close()}>
			<input
				type='file'
				onChange={handleUpload}
				ref={fileRef}
				className='hidden'
			/>

			<div className='fixed inset-0 bg-black/20' aria-hidden='true' />
			<Dialog.Panel className='absolute inset-center border-gray-300 border p-8 rounded-md w-[38rem] bg-white'>
				<Dialog.Title>Upload attachments</Dialog.Title>
				<div className='flex flex-col gap-2'>
					{attachments.map((e, i) => (
						<div
							className='flex bg-gray-100 p-4 items-center gap-4 rounded-md text-sm'
							key={i}
						>
							{getIconFromMimeType(e.mime)}
							<div className=''>
								<div>{e.name}</div>
								<div>{formatByteSizes(e.size)}</div>
							</div>
							<div
								className='ml-auto cursor-pointer'
								onClick={() => removeAttachment(i)}
							>
								<FontAwesomeIcon icon={faClose} />
							</div>
						</div>
					))}
				</div>
				<div className='flex gap-5 mt-6 text-sm'>
					<button
						className='bg-gray-400 py-2 px-5 rounded text-white'
						onClick={() => close()}
					>
						Close
					</button>
					<button
						className='bg-blue-500 py-2 px-5 rounded text-white'
						onClick={() => fileRef.current?.click()}
					>
						{' '}
						Upload
					</button>
				</div>
			</Dialog.Panel>
		</Dialog>
	);
}
