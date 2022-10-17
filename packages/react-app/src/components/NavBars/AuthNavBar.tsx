import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

type authTypes = 'SignUp' | 'SignIn';

export default function AuthNavBar(props: { type: authTypes }) {
	let elements;
	if (props.type == 'SignUp') {
		elements = <Link to='/signin'>Already have an account? Sign in</Link>;
	} else {
		elements = (
			<Link to='/signup'>Don&apos;t have an account? Sign up</Link>
		);
	}

	return (
		<div className='max-w-auto p-5'>
			<div className='flex justify-between'>
				<div className='inline-flex items-center gap-3 font-medium'>
					<Link to='/'>
						<div className='bg-blue-500 p-2 rounded-lg'>
							<img src={logo} className='w-auto h-12'></img>
						</div>
					</Link>
				</div>
				<div className='inline-flex items-center align-middle font-medium underline text-gray-400'>
					{elements}
				</div>
			</div>
		</div>
	);
}
