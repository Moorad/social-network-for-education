import React, { FormEvent, useState } from 'react';
import NavButtons from './NavButtons';

type propTypes = {
	next: Function
}

export default function Step1(props: propTypes) {
	function handleSubmission(e: FormEvent) {
		e.preventDefault();
		console.log('API call here')
		setTimeout(() => {
			props.next();
		}, 2000);
	}

	return <form onSubmit={(e) => handleSubmission(e)} className='flex flex-col gap-5'>
		<input placeholder='Display Name' type='text' className='border border-gray-300 rounded w-full px-4 py-1' required />
		<input placeholder='Email address' type='email' className='border border-gray-300 rounded w-full px-4 py-1' required />
		<input placeholder='Password' type='password' className='border border-gray-300 rounded w-full px-4 py-1' required/>
		<NavButtons hasSubmit />
	</form>
}
