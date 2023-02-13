import { faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLink, faShare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Popover } from '@headlessui/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function ShareButton(props: {
	postId: string;
	postTitle: string;
}) {
	const [open, setOpen] = useState(false);
	const shareData = {
		title: 'My App',
		text: props.postTitle,
		url: `${window.location.origin}/post/${props.postId}`,
	};

	function handleClick(e: React.MouseEvent) {
		e.stopPropagation();
		try {
			navigator.share(shareData);
		} catch (err) {
			setOpen(true);
		}
	}

	function copyText() {
		navigator.clipboard.writeText(shareData.url);
		toast.success('Copied link to your clipboard');
	}

	return (
		<div className='flex gap-2 items-center relative'>
			<Popover>
				<Popover.Button
					onClick={(e: React.MouseEvent) => handleClick(e)}
					className='flex gap-2 items-center text-gray-400'
				>
					<FontAwesomeIcon icon={faShare} className='text-gray-400' />
					<span className='text-gray-500'>Share</span>
				</Popover.Button>
				{open && (
					<Popover.Panel className='absolute z-10 bg-white border-gray-300 border rounded-lg p-5 right-0 translate-x-1/2 top-10'>
						<div className='flex gap-5'>
							<div
								className='flex flex-col gap-2 items-center'
								onClick={() => copyText()}
							>
								<span className='bg-gray-600 p-2 rounded-md w-9 h-9 text-center'>
									<FontAwesomeIcon
										icon={faLink}
										className='text-white'
									/>
								</span>
								<div className='text-sm text-gray-600 text-center whitespace-nowrap'>
									Copy Link
								</div>
							</div>
							<a
								href={`mailto:?subject=${shareData.text}&amp;body=${shareData.url}`}
							>
								<div className='flex flex-col gap-2 items-center'>
									<span className='bg-blue-500 p-2 rounded-md w-9 h-9 text-center'>
										<FontAwesomeIcon
											icon={faEnvelope}
											className='text-white'
										/>
									</span>
									<div className='text-sm text-gray-600 text-center'>
										Email
									</div>
								</div>
							</a>
							{/* This should theoretically work in production (With a proper none-localhost url) */}
							<a
								href={`https://www.facebook.com/sharer/sharer.php?u=${shareData.url}`}
							>
								<div className='flex flex-col gap-2 items-center'>
									<span className='bg-blue-600 p-2 rounded-md w-9 h-9 text-center'>
										<FontAwesomeIcon
											icon={faFacebook}
											className='text-white'
										/>
									</span>
									<div className='text-sm text-gray-600 text-center'>
										Facebook
									</div>
								</div>
							</a>
							<a
								href={`http://twitter.com/share?text=${shareData.text}&url=${shareData.url}`}
							>
								<div className='flex flex-col gap-2 items-center'>
									<span className='bg-sky-400 p-2 rounded-md w-9 h-9 text-center'>
										<FontAwesomeIcon
											icon={faTwitter}
											className='text-white'
										/>
									</span>
									<div className='text-sm text-gray-600 text-center'>
										Twitter
									</div>
								</div>
							</a>
						</div>
					</Popover.Panel>
				)}
			</Popover>
		</div>
	);
}
