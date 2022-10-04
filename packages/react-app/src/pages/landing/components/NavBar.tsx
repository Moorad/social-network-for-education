import React, { Component } from 'react';
import Button from '../../../components/Button';
import logo from "../../../assets/images/logo.png";

export default class NavBar extends Component {
	render() {
		return (
			<div>
				<div className='max-w-auto p-5'>
					<div className='flex justify-between'>
						<div className='inline-flex items-center gap-3 text-white font-medium'>
							<img src={logo} className='w-auto h-12 mr-5'></img>
							<a>Features</a>
							<a>Development</a>
							<a>Contact</a>
						</div>

						<div className="inline-flex items-center">
							<Button value='Log in' overrideClassName='bg-gray-500 text-white py-2 px-4 rounded' />
						</div>
					</div>
				</div>
			</div>
		);
	}
}