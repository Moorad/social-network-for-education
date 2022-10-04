import React, { Component } from 'react';
import NavBar from './components/NavBar';
import SignUpForm from './components/SignUpForm';

export default class Landing extends Component {
	render() {
		document.body.classList.add("bg-gray-900");
		return (
			<div>
				<NavBar/>
				<div>
					<SignUpForm/>
				</div>
			</div>
		)
	}
}