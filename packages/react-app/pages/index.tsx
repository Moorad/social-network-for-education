import React, { Component } from 'react';
import LandingNavBar from '../components/NavBars/LandingNavBar';
import ButtonGroup from '../components/ButtonGroup';

export default class Index extends Component {
	render() {
		// document.body.classList.add('', 'overflow-hidden');
		return (
			<div className='h-screen bg-gray-900'>
				{/* <div>
					<div
						className='absolute w-96 h-96 bg-indigo-500 rounded-full opacity-60 -z-50'
						style={{ filter: 'blur(220px)' }}
					></div>
					<div
						className='absolute w-96 h-96 bg-teal-400 rounded-full opacity-40 -z-50 -right-48 bottom-20 overflow-hidden'
						style={{ filter: 'blur(200px)' }}
					></div>
				</div> */}
				<LandingNavBar />
				<div className='flex mr-20 justify-between h-full'>
					<div className='flex flex-col text-white ml-20 justify-center mb-32'>
						<div className='font-bold text-5xl w-3/4 mb-10'>
							Lorem ipsum dolor sit amet consectetur!
						</div>
						<div className='w-3/4 text-2xl font-light'>
							Lorem ipsum dolor sit amet, consectetur adipiscing
							elit. Aenean vulputate vehicula sapien et tempor.
							Sed egestas, leo quis efficitur ultrices, augue
							neque sollicitudin diam.
						</div>
					</div>
					<div className='flex h-full'>
						<div className='m-auto'>
							<ButtonGroup />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
