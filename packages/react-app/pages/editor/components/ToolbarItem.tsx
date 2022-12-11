import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React from 'react';

type props = {
	icon: IconProp
}

export default function ToolbarItem({
	icon
}: props) {
	return (
		<div className='flex items-center justify-center text-gray-900 bg-gray-200 w-7 h-7 rounded-sm cursor-pointer'>
			<FontAwesomeIcon icon={icon} />
		</div>
	);
}
