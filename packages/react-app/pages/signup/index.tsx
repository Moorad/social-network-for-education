import React from 'react';
import AuthNavBar from '../../components/NavBars/AuthNavBar';
import SignUpForm from '../../components/Auth/SignUpForm';
export default function SignIn() {
	return (
		<>
			<AuthNavBar type='SignUp' />
			<div className='inset-center'>
				<SignUpForm />
			</div>
		</>
	);
}
