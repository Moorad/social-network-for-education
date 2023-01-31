import { Dialog } from '@headlessui/react';
import React from 'react';

type propsType = {
	title: string;
	description: string;
	children: JSX.Element;
	isOpen: boolean;
	setIsOpen: (state: boolean) => void;
};

export default function Modal(props: propsType) {
	return (
		<Dialog open={props.isOpen} onClose={() => props.setIsOpen(false)}>
			<div className='fixed inset-0 bg-black/20' aria-hidden='true' />
			<Dialog.Panel className='absolute inset-center border-gray-300 border p-8 rounded-md w-[38rem] bg-white'>
				<div className='my-4'>
					<Dialog.Title className='my-1'>{props.title}</Dialog.Title>
					{props.description && (
						<Dialog.Description className='text-gray-400 m-0 text-sm'>
							{props.description}
						</Dialog.Description>
					)}
				</div>

				{props.children}
			</Dialog.Panel>
		</Dialog>
	);
}

Modal.defaultProps = {
	description: '',
};
