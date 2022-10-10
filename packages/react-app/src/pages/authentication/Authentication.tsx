import React, { Component } from 'react';
import SignUpForm from './components/SignUpForm';
import SignInForm from './components/SignInForm';
import NavBar from './components/NavBar';


type propTypes = {
	type?: "SignUp" | "SignIn"
}


export default function Authentication(props: propTypes) {
	document.body.className = "";
	document.body.classList.add('bg-gray-100');
	
	function getForm() {
		if (props.type == "SignUp") {
			return <SignUpForm/>
		} else {
			return <SignInForm/>
		}
	}

	return <>
		<NavBar/>
		<div className='inset-center'>
			{getForm()}
		</div>
	</>
}