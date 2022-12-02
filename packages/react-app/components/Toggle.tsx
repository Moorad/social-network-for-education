import React, { useEffect } from 'react';
import { useState } from 'react';
import { Switch } from '@headlessui/react';

export default function Toggle(props: { defaultEnabled: boolean, onChange: (enabled: boolean) => void },) {
	const [enabled, setEnabled] = useState(props.defaultEnabled);

	useEffect(() => {
		props.onChange(enabled);
	}, [enabled]);

	return (
		<Switch
			checked={enabled}
			onChange={setEnabled}
			className={`${enabled ? 'bg-blue-500' : 'bg-gray-300'
				} relative inline-flex h-6 w-10 items-center rounded-full`}
		>
			<span className='sr-only'>Enable notifications</span>
			<span
				className={`${enabled ? 'translate-x-5' : 'translate-x-1'
					} inline-block h-4 w-4 transform rounded-full bg-white transition`}
			/>
		</Switch>
	);
}

Toggle.defaultProps = {
	defaultEnabled: false,
	onChange: (e: boolean) => e,
};