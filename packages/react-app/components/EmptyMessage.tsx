import React from 'react';

export default function EmptyMessage<T>({
	value,
	message,
	background,
}: {
	value: T[] | undefined;
	message: string;
	background: string;
}) {
	return (
		<>
			{(value == undefined || value.length == 0) && (
				<div
					className={
						'text-gray-500 text-center w-full p-4 rounded-md ' +
						background
					}
				>
					{message}
				</div>
			)}
		</>
	);
}

EmptyMessage.defaultProps = {
	background: 'bg-gray-100',
};
