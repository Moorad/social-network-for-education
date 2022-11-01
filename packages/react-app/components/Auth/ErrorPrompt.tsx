import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type propTypes = {
	message: string;
};

export default function ErrorPrompt(props: propTypes) {
	return (
		<div className={props.message == '' ? 'hidden' : ''}>
			<div className='flex justify-between text-center bg-red-100 text-red-500 border border-red-500 rounded py-1 px-3'>
				<FontAwesomeIcon
					icon={faCircleExclamation}
					className='self-center'
				/>
				<div>{props.message}</div>
				<div>{/* empty DOM element for centering */}</div>
			</div>
		</div>
	);
}
