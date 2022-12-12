import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React from 'react';

type props = {
	icon: IconProp,
	onClick?: () => void,
	className?: string
}

export default function ToolbarItem({
	icon,
	className,
	onClick
}: props) {
	return (
		<div className={'flex items-center justify-center px-2 h-7 rounded-sm cursor-pointer ' + className} onClick={onClick}>
			<FontAwesomeIcon icon={icon} />
		</div>
	);
}

ToolbarItem.defaultProps = {
	className: 'text-gray-900 bg-gray-200'
};
