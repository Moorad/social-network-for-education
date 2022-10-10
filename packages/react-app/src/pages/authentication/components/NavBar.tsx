import React, { Component } from 'react';
import logo from "../../../assets/images/logo.png";

export default class NavBar extends Component {
	render() {
		return (
			<div>
				<div className='max-w-auto p-5'>
					<div className='flex justify-between'>
						<div className='inline-flex items-center gap-3 font-medium'>
							<img src={logo} className='w-auto h-12 mr-5 invert'></img>
						</div>
							<div className="inline-flex items-center align-middle font-medium underline text-gray-400">
								<a href="signin">
									Already have an account? Sign in
								</a>
							</div>
						
					</div>
				</div>
			</div>
		);
	}
}