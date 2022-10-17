import React from 'react';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import AuthNavBar from '../../components/NavBars/AuthNavBar';

type propTypes = {
	type: 'SignUp' | 'SignIn';
};

export default function Authentication(props: propTypes) {
	document.body.className = '';
	document.body.classList.add('bg-gray-100');

	function getForm() {
		if (props.type == 'SignUp') {
			return <SignUpForm />;
		} else {
			return <SignInForm />;
		}
	}

	return (
		<>
			<AuthNavBar type={props.type} />
			<div className='inset-center'>{getForm()}</div>
		</>
	);
}
