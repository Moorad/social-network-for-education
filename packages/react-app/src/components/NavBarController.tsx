import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

/*	"LandingNavBar" for Landing page
	"AuthNavBar" for authentication pages (/signin and /signup)
	"MainNavBar" for main protected pages (/home, /profile, etc)
*/
type NavBarTypes = 'LandingNavBar' | 'AuthNavBar' | 'MainNavbar';

type authTypes = 'SignUp' | 'SignIn';

export default class NavBarController extends Component<{
	type: NavBarTypes;
	authType?: authTypes;
}> {
	constructor(props: { type: NavBarTypes; authType: authTypes }) {
		super(props);
	}

	getAppropriateNavBar() {
		if (this.props.type === 'LandingNavBar') {
			return <LandingNavBar />;
		} else if (this.props.type === 'AuthNavBar') {
			return <AuthNavBar type={this.props.authType || 'SignIn'} />;
		} else if (this.props.type === 'MainNavbar') {
			return <MainNavBar />;
		}
	}

	render() {
		return (
			<div className='max-w-auto p-5'>
				<div className='flex justify-between'>
					{this.getAppropriateNavBar()}
				</div>
			</div>
		);
	}
}

function LandingNavBar() {
	return (
		<>
			<div className='inline-flex items-center gap-3 text-white font-medium'>
				<Link to='/'>
					<img src={logo} className='w-auto h-12 mr-5'></img>
				</Link>
				<a>Features</a>
				<a>Development</a>
				<a>Contact</a>
			</div>

			<div className='inline-flex items-center'>
				<Link to='/signin'>
					<button className='bg-gray-500 text-white py-2 px-4 rounded'>
						Log in
					</button>
				</Link>
			</div>
		</>
	);
}

function AuthNavBar(props: { type: authTypes }) {
	let elements;
	if (props.type == 'SignUp') {
		elements = <Link to='/signin'>Already have an account? Sign in</Link>;
	} else {
		elements = (
			<Link to='/signup'>Don&apos;t have an account? Sign up</Link>
		);
	}

	return (
		<>
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
		</>
	);
}

function MainNavBar() {
	return <div></div>;
}
