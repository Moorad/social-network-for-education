import React, { Component } from 'react';
import NavBar from './components/NavBar';

export default class Landing extends Component {
	render() {
		document.body.classList.add("bg-gray-900");
		return (<NavBar/>)
	}
}