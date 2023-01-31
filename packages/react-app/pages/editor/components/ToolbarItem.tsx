import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React from 'react';

type props = {
	icon: IconProp;
	onClick?: () => void;
	onMouseDown?: () => void;
	className: string;
	badgeValue: number;
	badgeClassName: string;
};

export default function ToolbarItem({
	icon,
	className,
	badgeValue,
	badgeClassName,
	onClick,
	onMouseDown,
}: props) {
	return (
		<button
			className={
				'flex relative items-center justify-center px-2 h-7 rounded-sm  cursor-pointer ' +
				className
			}
			onClick={onClick}
			onMouseDown={onMouseDown}
		>
			{badgeValue > 0 && (
				<span
					className={
						'flex font-normal rounded-full h-5 w-5 text-xs justify-center items-center align-middle absolute -top-3 -right-3 z-10 ' +
						badgeClassName
					}
				>
					{badgeValue}
				</span>
			)}

			<FontAwesomeIcon icon={icon} />
		</button>
	);
}

ToolbarItem.defaultProps = {
	className: 'hover:bg-gray-300 text-gray-900 bg-gray-200',
	badgeValue: 0,
	badgeClassName: 'bg-gray-900 text-gray-100',
};
