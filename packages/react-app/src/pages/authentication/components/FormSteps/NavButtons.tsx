import React from 'react';

type propTypes = {
	hasNext?: boolean;
	hasSubmit?: boolean;
	onBack?: () => void;
};

export default function NavButtons(props: propTypes) {
	function getButtons() {
		const elements = [];
		if (props.onBack) {
			elements.push(
				<button
					className='bg-blue-500 py-2 px-6 rounded'
					type='button'
					onClick={() => {
						props.onBack?.();
					}}
					key={elements.length}
				>
					Back
				</button>
			);
		}

		if (props.hasNext) {
			elements.push(
				<button
					type='submit'
					className='bg-blue-500 py-2 px-6 rounded'
					key={elements.length}
				>
					Next
				</button>
			);
		}

		if (props.hasSubmit) {
			elements.push(
				<button
					type='submit'
					className='bg-blue-500 py-2 px-6 rounded'
					key={elements.length}
				>
					Submit
				</button>
			);
		}

		return <>{elements.map((e) => e)}</>;
	}

	return (
		<div className='flex justify-end text-sm gap-3 text-white mt-14'>
			{getButtons()}
		</div>
	);
}
