import React, { useState } from 'react';
import router from 'next/router';
import Step1 from './Steps/Step1';

export default function SignUpForm() {
	const [step, setStep] = useState(0);
	const steps = [
		{
			title: 'Account Details',
			description:
				'Provide us with account creation details to get started',
			element: <Step1 next={handleNextStep} />,
		},
	];

	function handleNextStep() {
		if (step < steps.length - 1) {
			setStep(step + 1);
			console.log('curent step', step);
		} else {
			router.push('/home');
		}
	}

	return (
		<div className='relative w-fit h-fit bg-gray-50 px-10 py-16 rounded-lg align-middle border-gray-300 border max-w-md'>
			<div className='flex top-0 left-0 w-full justify-center gap-2'>
				{steps.map((e, i) => {
					let classes = 'block w-2 h-2 rounded-full';
					if (step == i) {
						classes += ' bg-blue-500';
					} else {
						classes += ' bg-gray-300';
					}

					return <span className={classes} key={i}></span>;
				})}
			</div>
			<div className='text-center pb-16 text-black'>
				<div className='text-3xl font-bold py-3'>
					{steps[step].title}
				</div>
				<div className='text-gray-600 text-lg'>
					{steps[step].description}
				</div>
			</div>
			<div>{steps[step].element}</div>
		</div>
	);
}
