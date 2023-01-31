import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation } from 'react-query';
import { AttachmentType } from '..';
import { uploadAnyFile } from '../../../api/userApi';
import Modal from '../../../components/Modal';
import { getIconFromMimeType } from '../../../utils/file';
import { formatByteSizes } from '../../../utils/format';

export default function AttachmentModal({
	isOpen,
	setIsOpen,
	pushAttachmentURL,
	removeAttachmentURL,
}: {
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
	pushAttachmentURL: (att: AttachmentType) => void;
	removeAttachmentURL: (index: number) => void;
}) {
	const [attachments, setAttachments] = useState<AttachmentType[]>([]);
	const fileRef = useRef<HTMLInputElement>(null);
	const uploadMutation = useMutation(uploadAnyFile, {
		onSuccess: (res) => {
			pushAttachment({
				name: res.name,
				mime: res.mime,
				size: res.size,
				url: res.url,
			});
			toast.success('Uploaded sucessfully');
		},
		onError: () => {
			toast.error('Failed to upload image');
		},
	});

	function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			const formData = new FormData();

			formData.append('file', e.target.files[0]);

			uploadMutation.mutate({
				formData: formData,
			});
		}
	}

	function pushAttachment(att: AttachmentType) {
		setAttachments([...attachments, att]);

		pushAttachmentURL(att);
	}

	function removeAttachment(index: number) {
		setAttachments(attachments.filter((_, i) => i != index));

		removeAttachmentURL(index);
	}

	return (
		<Modal
			title='Upload attachments'
			isOpen={isOpen}
			setIsOpen={() => setIsOpen(false)}
		>
			<div>
				<input
					type='file'
					onChange={handleUpload}
					ref={fileRef}
					className='hidden'
				/>
				<div className='flex flex-col gap-2 max-h-60 overflow-auto'>
					{attachments.length == 0 && (
						<div className='bg-gray-100 text-gray-500 p-4 items-center text-center gap-4 rounded-md text-md'>
							You have not uploaded any files
						</div>
					)}
					{attachments.map((e, i) => (
						<div
							className='flex bg-gray-100 p-4 items-center gap-4 rounded-md text-sm'
							key={i}
						>
							<FontAwesomeIcon
								icon={getIconFromMimeType(e.mime).icon}
								className={
									'text-3xl ' +
									getIconFromMimeType(e.mime).color
								}
							/>
							<div>
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
						onClick={() => setIsOpen(false)}
					>
						Close
					</button>
					<button
						className='bg-blue-500 py-2 px-5 rounded text-white'
						onClick={() => fileRef.current?.click()}
					>
						Upload
					</button>
				</div>
			</div>
		</Modal>
	);
}
