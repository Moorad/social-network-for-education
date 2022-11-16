import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLink, faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Popover } from '@headlessui/react';
import React from 'react'

export default function ShareButton() {

	function handleClick(e: React.MouseEvent) {
		e.stopPropagation();
		console.log('share clicked')
	}
	return (
		<div className='flex gap-2 items-center relative'>
			<Popover>
				<Popover.Button onClick={(e: React.MouseEvent) => handleClick(e)}>
					<FontAwesomeIcon
						icon={faShare}
						className='text-gray-400'
					/> Share</Popover.Button>
				<Popover.Panel className='absolute z-10 bg-white border-gray-300 border rounded-lg p-5 right-0 translate-x-1/2 top-10'>
					<div className='flex gap-5'>
						<div className='flex flex-col gap-2'>
							<span className='bg-gray-600 mx-auto p-2 rounded-md w-9 h-9 text-center'>
								<FontAwesomeIcon icon={faLink} className='text-white' /></span>
							<div className='text-sm text-gray-600'>Copy Link</div>
						</div>
						<div className='flex flex-col gap-2'>
							<span className='bg-blue-500 mx-auto p-2 rounded-md w-9 h-9 text-center'>
								<FontAwesomeIcon icon={faEnvelope} className='text-white' /></span>
							<div className='text-sm text-gray-600'>Email</div>
						</div>
						<div className='flex flex-col gap-2'>
							<span className='bg-blue-600 mx-auto p-2 rounded-md w-9 h-9 text-center'>
								<FontAwesomeIcon icon={faFacebook} className='text-white' /></span>
							<div className='text-sm text-gray-600'>Facebook</div>
						</div>
						<div className='flex flex-col gap-2'>
							<span className='bg-sky-400 mx-auto p-2 rounded-md w-9 h-9 text-center'>
								<FontAwesomeIcon icon={faTwitter} className='text-white' /></span>
							<div className='text-sm text-gray-600'>Twitter</div>
						</div>
					</div>
				</Popover.Panel>
			</Popover>
		</div>
	)
}
