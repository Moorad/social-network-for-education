import React, { Component } from 'react';
import logo from '../../../assets/images/logo.png';

type propTypes = {
	type: 'SignUp' | 'SignIn';
};

export default function Navbar(props: propTypes) {
	let elements;
	if (props.type == 'SignUp') {
		elements = (
			<div className='inline-flex items-center align-middle font-medium underline text-gray-400'>
				<a href='signin'>Already have an account? Sign in</a>
			</div>
		);
	} else {
		elements = (
			<div className='inline-flex items-center align-middle font-medium underline text-gray-400'>
				<a href='signup'>Don&apos;t have an account? Sign up</a>
			</div>
		);
	}

	return (
		<div>
			<div className='max-w-auto p-5'>
				<div className='flex justify-between'>
					<div className='inline-flex items-center gap-3 font-medium'>
						<img
							src={logo}
							className='w-auto h-12 mr-5 invert'
						></img>
					</div>
					{elements}
				</div>
			</div>
		</div>
	);
}
