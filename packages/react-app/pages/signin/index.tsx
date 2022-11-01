import React from 'react';
import AuthNavBar from '../../components/NavBars/AuthNavBar';
import SignInFrom from '../../components/Auth/SignInForm';
export default function SignIn() {
	return (
		<>
			<AuthNavBar type='SignIn' />
			<div className='inset-center'>
				<SignInFrom />
			</div>
		</>
	);
}
