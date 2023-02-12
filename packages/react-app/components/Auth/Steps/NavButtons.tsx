import React from 'react';
import Button from '../../Button';

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
				<Button
					type='button'
					size='small'
					onClick={() => {
						props.onBack?.();
					}}
					key={elements.length}
				>
					Back
				</Button>
			);
		}

		if (props.hasNext) {
			elements.push(
				<Button
					type='submit'
					size='small'
					variant='primary'
					key={elements.length}
				>
					Next
				</Button>
			);
		}

		if (props.hasSubmit) {
			elements.push(
				<Button
					type='submit'
					size='small'
					variant='primary'
					key={elements.length}
				>
					Submit
				</Button>
			);
		}

		return <>{elements.map((e) => e)}</>;
	}

	return (
		<div className='flex justify-end gap-3 text-white mt-14'>
			{getButtons()}
		</div>
	);
}
