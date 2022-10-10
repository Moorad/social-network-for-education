import React from 'react';

type propTypes = {
	hasNext?: boolean,
	hasSubmit?: boolean
	onBack?: Function,
}

export default function NavButtons(props: propTypes) {
	function getButtons() {
		let elements = []
		if (props.onBack) {
			elements.push(
				<button className='bg-blue-500 py-2 px-6 rounded' type='button' onClick={() => {props.onBack?.();}}>
					Back
				</button>
			);
		}

		if (props.hasNext) {
			elements.push(
				<button type='submit' className='bg-blue-500 py-2 px-6 rounded'>
					Next
				</button>
			);
		}

		if (props.hasSubmit) {
			elements.push(
				<button type='submit' className='bg-blue-500 py-2 px-6 rounded'>
					Submit
				</button>
			);
		}

		return <>
			{elements.map((e) => e)}
		</>
	}

	return (
		<div className='flex justify-end text-sm gap-3 text-white mt-14'>
			{getButtons()}
		</div>
	)
}