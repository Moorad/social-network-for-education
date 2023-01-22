import { faClose, faFile, faFileExcel, faFileImage, faFilePdf, faFilePowerpoint, faFileWord, faFileZipper, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog } from '@headlessui/react';
import React, { useEffect, useRef, useState } from 'react';
import { formatByteSizes } from '../../../utils/format';

type attachementType = {
	filename: string,
	type: string,
	size: number
}

export default function AttachmentModal({ open, close, setAttachmentCount }: { open: boolean, close: () => void, setAttachmentCount: (count: number) => void }) {
	// const [isOpen, setIsOpen] = useState(open);
	const [attachments, setAttachments] = useState<attachementType[]>([]);
	const fileRef = useRef<HTMLInputElement>(null);

	function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			const attachementsData = [];
			for (let i = 0; i < e.target.files.length; i++) {
				attachementsData.push({
					filename: e.target.files[i].name,
					type: e.target.files[i].type,
					size: e.target.files[i].size
				});

				setAttachments([
					...attachments,
					...attachementsData
				]);
			}
		}
	}

	useEffect(() => {
		setAttachmentCount(attachments.length);
	}, [attachments]);

	function getIconFromMimeType(mimeType: string) {
		let icon: IconDefinition;
		let iconColor: string;
		switch (mimeType) {
			case ('application/msword'):
				icon = faFileWord;
				iconColor = 'text-blue-500';
				break;
			case ('application/vnd.openxmlformats-officedocument.wordprocessingml.document'):
				icon = faFileWord;
				iconColor = 'text-blue-500';
				break;
			case ('application/vnd.ms-powerpoint'):
				icon = faFilePowerpoint;
				iconColor = 'text-orange-600';
				break;
			case ('application/vnd.openxmlformats-officedocument.presentationml.presentation'):
				icon = faFilePowerpoint;
				iconColor = 'text-orange-600';
				break;
			case ('application/vnd.ms-excel'):
				icon = faFileExcel;
				iconColor = 'text-emerald-600';
				break;
			case ('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'):
				icon = faFileExcel;
				iconColor = 'text-emerald-600';
				break;
			case ('application/zip'):
				icon = faFileZipper;
				iconColor = 'text-amber-400';
				break;
			case ('application/x-zip-compressed'):
				icon = faFileZipper;
				iconColor = 'text-amber-400';
				break;
			case ('application/pdf'):
				icon = faFilePdf;
				iconColor = 'text-red-500';
				break;
			case ('image/jpeg'):
				icon = faFileImage;
				iconColor = 'text-emerald-600';
				break;
			case ('image/png'):
				icon = faFileImage;
				iconColor = 'text-emerald-600';
				break;
			default:
				icon = faFile;
				iconColor = 'text-gray-700';
				break;
		}

		return <FontAwesomeIcon icon={icon} className={'text-3xl ' + iconColor} />;
	}

	return (
		<Dialog open={open} onClose={() => close()}>
			<input
				type='file'
				onChange={handleUpload}
				ref={fileRef}
				className='hidden'
				multiple
			/>
			<Dialog.Panel className='absolute inset-center border-gray-300 border p-8 rounded-md w-[38rem] bg-white'>
				<Dialog.Title>
					Upload attachments
				</Dialog.Title>
				<div className='flex flex-col gap-2'>
					{attachments.map((e, i) => (
						<div className='flex bg-gray-100 p-4 items-center gap-4 rounded-md text-sm' key={i}>
							{getIconFromMimeType(e.type)}
							<div className=''>
								<div>{e.filename}</div>
								<div>{formatByteSizes(e.size)}</div>
							</div>
							<div className='ml-auto cursor-pointer' onClick={() => setAttachments(attachments.filter((_, key) => key != i))}><FontAwesomeIcon icon={faClose} /></div>

						</div>))}
				</div>
				<div className='flex gap-5 mt-6 text-sm'>
					<button className='bg-gray-400 py-2 px-5 rounded text-white' onClick={() => close()}>Close</button>
					<button className='bg-blue-500 py-2 px-5 rounded text-white' onClick={() => fileRef.current?.click()}> Upload</button>
				</div>
			</Dialog.Panel>
		</Dialog >
	);
}
