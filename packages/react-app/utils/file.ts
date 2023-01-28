import {
	faFile,
	faFileExcel,
	faFileImage,
	faFilePdf,
	faFilePowerpoint,
	faFileWord,
	faFileZipper,
	IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

export function getIconFromMimeType(mimeType: string) {
	let icon: IconDefinition;
	let color: string;
	switch (mimeType) {
		case 'application/msword':
			icon = faFileWord;
			color = 'text-blue-500';
			break;
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			icon = faFileWord;
			color = 'text-blue-500';
			break;
		case 'application/vnd.ms-powerpoint':
			icon = faFilePowerpoint;
			color = 'text-orange-600';
			break;
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			icon = faFilePowerpoint;
			color = 'text-orange-600';
			break;
		case 'application/vnd.ms-excel':
			icon = faFileExcel;
			color = 'text-emerald-600';
			break;
		case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
			icon = faFileExcel;
			color = 'text-emerald-600';
			break;
		case 'application/zip':
			icon = faFileZipper;
			color = 'text-amber-400';
			break;
		case 'application/x-zip-compressed':
			icon = faFileZipper;
			color = 'text-amber-400';
			break;
		case 'application/pdf':
			icon = faFilePdf;
			color = 'text-red-500';
			break;
		case 'image/jpeg':
			icon = faFileImage;
			color = 'text-emerald-600';
			break;
		case 'image/png':
			icon = faFileImage;
			color = 'text-emerald-600';
			break;
		default:
			icon = faFile;
			color = 'text-gray-700';
			break;
	}

	return {
		icon: icon,
		color: color,
	};
}
