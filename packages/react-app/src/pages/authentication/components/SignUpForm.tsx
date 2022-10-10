import React, { FormEvent, useState } from 'react'
import Step1 from './FormSteps/Step1';


export default function SignUpForm() {
	const [error, setError] = useState('');
	const [isFetching, setIsFetching] = useState(false);
	const [displayName, setDisplayName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	let [step, setStep] = useState(0);
	const steps = [{
		title: 'Account Details',
		description: 'Provide us with account creation details to get started',
		element: <Step1 next={handleNextStep}/>
	}]

	function handleNextStep() {

		if (step < steps.length) {
			setStep(step + 1);
			console.log('curent step', step)
		}
	}

	function handleSubmission(e: FormEvent) {
		e.preventDefault();
		setError('');
		setIsFetching(true);
		fetch('http://localhost:4000/api/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'displayName': displayName,
				'email': email,
				'password': password
			})
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error(`${res.status} ${res.statusText}`);
				}

				return res.json();
			})
			.catch((err) => {
				setError(err.name + ': ' + err.message);
			})
			.then((res) => {
				console.log(res)
				setIsFetching(false);
			})
	}

	function loadingButton() {
		if (isFetching) {
			return (
				<div className='flex justify-center'>
					<svg className='mr-3 h-6 w-6 animate-spin text-white' fill='none' viewBox='0 0 24 24'>
						<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
						<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
					</svg>
				</div>
			);
		} else {
			return 'Create your account';
		}
	}

	return (
		<div className='relative w-fit h-fit bg-gray-50 px-10 py-16 rounded-lg align-middle border-gray-300 border max-w-md'>
			<div className='flex top-0 left-0 w-full justify-center gap-2'>
				{steps.map((e, i) => {
					let classes = 'block w-2 h-2 rounded-full'
					if (step == i) {
						classes += ' bg-blue-500'
					} else {
						classes += ' bg-gray-300'
					}

					return <span className={classes}></span>
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
				<div>
					{steps[step].element}
				</div>
		</div>)
}