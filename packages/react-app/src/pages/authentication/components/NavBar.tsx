import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/images/logo.png';

type propTypes = {
	type: 'SignUp' | 'SignIn';
};

export default function Navbar(props: propTypes) {
	let elements;
	if (props.type == 'SignUp') {
		elements = (
			<div className='inline-flex items-center align-middle font-medium underline text-gray-400'>
				<Link to='/signin'>Already have an account? Sign in</Link>
			</div>
		);
	} else {
		elements = (
			<div className='inline-flex items-center align-middle font-medium underline text-gray-400'>
				<Link to='/signup'>Don&apos;t have an account? Sign up</Link>
			</div>
		);
	}

	return (
		<div>
			<div className='max-w-auto p-5'>
				<div className='flex justify-between'>
					<div className='inline-flex items-center gap-3 font-medium'>
						<Link to='/'>
							<img
								src={logo}
								className='w-auto h-12 mr-5 invert'
							></img>
						</Link>
					</div>
					{elements}
				</div>
			</div>
		</div>
	);
}
