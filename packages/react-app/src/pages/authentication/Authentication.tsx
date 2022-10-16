import React from 'react';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import NavBarController from '../../components/NavBarController';

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
			<NavBarController type='AuthNavBar' authType={props.type} />
			<div className='inset-center'>{getForm()}</div>
		</>
	);
}
