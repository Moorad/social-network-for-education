import React, { Component } from 'react';
import LandingNavBar from '../components/NavBars/LandingNavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronRight,
	faComment,
	faGraduationCap,
	faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Button from '../components/Button';

export default class Index extends Component {
	render() {
		return (
			<div className='h-screen'>
				<LandingNavBar />
				<div className='h-screen px-20'>
					<div className='flex justify-between h-4/6'>
						<div className='flex flex-col justify-center w-1/2'>
							<div className='font-bold text-5xl mb-10 leading-tight text-gray-900'>
								The Open Learning Environment
							</div>
							<div className='text-2xl leading-snug font-regular mb-12 text-gray-700'>
								An attempt of reimagining social networks as an
								informal learning management systems. A free and
								public available platform with high quality
								learning material.
							</div>
							<div>
								<Link href='/signup'>
									<Button variant='primary'>
										Sign up for free today!
										<FontAwesomeIcon
											icon={faChevronRight}
											className='ml-3'
										/>
									</Button>
								</Link>
							</div>
						</div>
						<div className='flex flex-row-reverse h-full w-1/2'>
							<div className='my-auto'>
								<img src='/undraw_landing.svg' className='' />
							</div>
						</div>
					</div>
					<div className='flex justify-between w-96 text-center'>
						<div className='w-24'>
							<div className='text-xl font-bold text-gray-900'>
								0
							</div>
							<div className='text-sm'>Learners signed up</div>
						</div>
						<div className='w-24'>
							<div className='text-xl font-bold text-gray-900'>
								0
							</div>
							<div className='text-sm'>Resources shared</div>
						</div>
						<div className='w-24'>
							<div className='text-xl font-bold text-gray-900'>
								0
							</div>
							<div className='text-sm'>Messages sent</div>
						</div>
					</div>
				</div>

				<div>
					<img src='/section_transition.svg' className='w-full' />
					<div className='bg-gray-100 text-center'>
						<div className='mb-28'>
							<div
								className='text-gray-900 text-4xl font-bold py-5'
								id='features'
							>
								Why use the platform?
							</div>
							<div className='text-gray-600'>
								Here are some qualities of the platform that
								might convince you to use it.
							</div>
							<div className='flex justify-center gap-8 my-16 flex-wrap'>
								<div className='w-80'>
									<div className='text-4xl mb-6 text-gray-900'>
										<FontAwesomeIcon
											icon={faShieldHalved}
										/>
									</div>
									<div className='font-bold text-lg mb-4 text-gray-800'>
										Security and Safety
									</div>
									<div className='text-sm text-gray-500 '>
										It is important to us to keep users as
										safe as possible from malicious
										activity. We also highly value the
										users’ privacy while keeping the
										platform open and accessible.
									</div>
								</div>
								<div className='w-80'>
									<div className='text-4xl mb-6 text-gray-900'>
										<FontAwesomeIcon icon={faComment} />
									</div>
									<div className='font-bold text-lg mb-4 text-gray-800'>
										Communication
									</div>
									<div className='text-sm text-gray-500 '>
										The platform implements the common
										social features that everyone is
										familiar with like direct and group
										messaging, comments, following system
										and more!
									</div>
								</div>
								<div className='w-80'>
									<div className='text-4xl mb-6 text-gray-900'>
										<FontAwesomeIcon
											icon={faGraduationCap}
										/>
									</div>
									<div className='font-bold text-lg mb-4 text-gray-800'>
										High quality resources
									</div>
									<div className='text-sm text-gray-500 '>
										With the great set of tools we provide
										to share and create learning resources
										along with having experts and
										institutions on the platform. We have
										the highest quality learning resources
										out there.
									</div>
								</div>
							</div>
						</div>
						<div>
							<div
								className='text-gray-900 text-4xl font-bold py-5'
								id='development'
							>
								Tools used in development
							</div>
							<div className='text-gray-600'>
								This is a list of some of the libraries and
								tools used in the development of the project.
							</div>
							<div className='flex justify-center flex-wrap gap-x-10 gap-y-2 py-16 max-w-[36rem] mx-auto'>
								<div>
									<div
										className='w-20 h-20 p-3 rounded-2xl flex'
										style={{ background: '#000000' }}
									>
										<img
											src='/logos/express.png'
											className='m-auto'
										/>
									</div>
									<div className='my-2 font-semibold'>
										Express.js
									</div>
								</div>
								<div>
									<div
										className='w-20 h-20 p-3 rounded-2xl flex'
										style={{ background: '#030F08' }}
									>
										<img
											src='/logos/node.png'
											className='m-auto'
										/>
									</div>
									<div className='my-2 font-semibold'>
										Node.js
									</div>
								</div>
								<div>
									<div
										className='w-20 h-20 p-3 rounded-2xl flex'
										style={{ background: '#060D0F' }}
									>
										<img
											src='/logos/react.png'
											className='m-auto'
										/>
									</div>
									<div className='my-2 font-semibold'>
										React
									</div>
								</div>
								<div>
									<div
										className='w-20 h-20 p-3 rounded-2xl flex'
										style={{ background: '#010F07' }}
									>
										<img
											src='/logos/mongo.png'
											className='m-auto'
										/>
									</div>
									<div className='my-2 font-semibold'>
										MongoDB
									</div>
								</div>
								<div>
									<div
										className='w-20 h-20 p-3 rounded-2xl flex'
										style={{ background: '#00090F' }}
									>
										<img
											src='/logos/typescript.png'
											className='m-auto'
										/>
									</div>
									<div className='my-2 font-semibold'>
										TypeScript
									</div>
								</div>
								<div>
									<div
										className='w-20 h-20 p-3 rounded-2xl flex'
										style={{ background: '#000000' }}
									>
										<img
											src='/logos/next.png'
											className='m-auto'
										/>
									</div>
									<div className='my-2 font-semibold'>
										Next.js
									</div>
								</div>
								<div>
									<div
										className='w-20 h-20 p-3 rounded-2xl flex'
										style={{ background: '#000000' }}
									>
										<img
											src='/logos/passport.png'
											className='m-auto'
										/>
									</div>
									<div className='my-2 font-semibold'>
										Passport.js
									</div>
								</div>
								<div>
									<div
										className='w-20 h-20 p-3 rounded-2xl flex'
										style={{ background: '#0A060F' }}
									>
										<img
											src='/logos/redux.png'
											className='m-auto'
										/>
									</div>
									<div className='my-2 font-semibold'>
										Redux
									</div>
								</div>
								<div>
									<div
										className='w-20 h-20 p-3 rounded-2xl flex'
										style={{ background: '#000D0F' }}
									>
										<img
											src='/logos/tailwind.png'
											className='m-auto'
										/>
									</div>
									<div className='my-2 font-semibold'>
										Tailwind
									</div>
								</div>
							</div>
						</div>
					</div>
					<img
						src='/section_transition.svg'
						className='w-full'
						style={{ transform: 'scaleY(-1) scaleX(-1)' }}
					/>
				</div>

				<div>
					<div className='mb-28 text-center'>
						<div
							className='text-gray-900 text-4xl font-bold py-5'
							id='details'
						>
							Project details
						</div>
						<div className='text-gray-600'>
							This is some background behind the project and why I
							created it
						</div>
						<div className='flex justify-center w-1/2 mx-auto'>
							<div className='text-gray-500 w-4/6 p-14 text-left'>
								This project was my chosen final year project at
								Swansea University. In Swansea University (for
								the Computer Science course at least) you get to
								choose a project that you want to work on in
								your final year. The project you choose should
								roughly take you around 300 hrs to make and
								should be developed solo. I enjoyed making this
								platform and it taught me a lot about web
								development and project management (software and
								timing wise). This project is expected to be
								complete on the 15th of April but with the
								current development progress, it is expected to
								be complete sooner :).
							</div>
							<div className='flex flex-col justify-center w-2/6 p-14'>
								<img src='/logos/swansea.png' className='' />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
