import { faMessage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import Loading from '../../components/Loading';
import MainNavBar from '../../components/NavBars/MainNavBar';
import useAuth from '../../utils/hooks/useAuth';

type person = {
	name: string;
	lastMessage: string;
	timestamp: string;
};

const people = [
	{
		name: 'Jack Michael',
		lastMessage: 'I will send you the document onc...',
		timestamp: '11:15',
	},
	{
		name: 'Ridwan Kirby',
		lastMessage: 'He wore the surgical mask in publ...',
		timestamp: '11:15',
	},
	{
		name: 'Arman Mcconnell',
		lastMessage: 'If you really strain your ears, yo...',
		timestamp: '11:15',
	},
	{
		name: 'Hugh Banks',
		lastMessage: 'I want to buy a onesie',
		timestamp: '11:15',
	},
	{
		name: 'The Awesome GC',
		lastMessage: 'are you going to the business me...',
		timestamp: '11:15',
	},
];

const messages = [
	{
		message: 'Hello world',
		sender: '63db9802f9f938e591838391',
	},
	{
		message: 'Hello world back',
		sender: '63db9802f9f938e591838392',
	},
	{
		message: 'Joe waited for the train. "Joe" = subject, "waited" = verb.',
		sender: '63db9802f9f938e591838392',
	},
	{
		message:
			'Mary and Samantha arrived at the bus station early but waited until noon for the bus. Mary and Samantha arrived at the bus station early but waited until noon for the bus.',
		sender: '63db9802f9f938e591838392',
	},
	{
		message: 'Hello world back',
		sender: '63db9802f9f938e591838391',
	},
	{
		message: 'Joe waited for the train. "Joe" = subject, "waited" = verb.',
		sender: '63db9802f9f938e591838391',
	},
	{
		message:
			'Mary and Samantha arrived at the bus station early but waited until noon for the bus. Mary and Samantha arrived at the bus station early but waited until noon for the bus.',
		sender: '63db9802f9f938e591838391',
	},
];

export default function index() {
	const { fetching, user } = useAuth();
	const [selectedUser, setSelectedUser] = useState<{
		user: person | null;
		index: number;
	}>({ user: null, index: -1 });
	const MessageContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		MessageContainerRef.current?.scroll({
			top: MessageContainerRef.current?.scrollHeight,
		});
	}, [selectedUser]);

	if (fetching) {
		return <Loading />;
	}

	return (
		<MainNavBar active={2}>
			<div className='flex h-full'>
				<div className='flex flex-col w-72 ml-2'>
					<div className='font-bold text-2xl text-center my-5'>
						Chat
					</div>
					<div className='flex justify-center px-4'>
						<input
							className=' border border-gray-300 px-2 py-1 text-sm w-full rounded-sm'
							type='text'
							placeholder='Search'
						/>
					</div>
					<div className='mt-5 overflow-auto flex-grow'>
						{people.map((person, i) => (
							<button
								key={i}
								className={
									'flex py-2 px-3 gap-4 text-left hover:bg-gray-100 w-full ' +
									(selectedUser.index == i
										? 'bg-gray-100'
										: '')
								}
								onClick={() =>
									setSelectedUser({ user: person, index: i })
								}
							>
								<div className='my-auto'>
									<div className='h-12 w-12 bg-blue-500 rounded-full'></div>
								</div>
								<div className='flex flex-col w-full'>
									<div className='flex justify-between'>
										<div className='font-semibold'>
											{person.name}
										</div>
										<div className='text-xs font-semibold text-gray-500'>
											{person.timestamp}
										</div>
									</div>
									<div className='text-sm text-gray-500 overflow-clip'>
										{person.lastMessage}
									</div>
								</div>
							</button>
						))}
					</div>
				</div>
				<div className='flex-grow p-2'>
					<div className='bg-gray-100 rounded-xl w-full h-full '>
						{selectedUser.user == null && (
							<div className='flex justify-center items-center w-full h-full'>
								<div className='flex flex-col gap-5 text-center text-gray-300'>
									<FontAwesomeIcon
										className='text-5xl'
										icon={faMessage}
									/>
									<div>No chat opened</div>
								</div>
							</div>
						)}

						{selectedUser.user && (
							<div className='flex flex-col px-2 py-2 h-full gap-4'>
								<div className='flex items-center gap-5 bg-white rounded-xl p-2'>
									<div className='h-10 w-10 bg-blue-500 rounded-full'></div>
									<div className='font-bold'>
										{selectedUser.user.name}
									</div>
								</div>

								<div
									className='flex flex-col gap-2 justify-items-center flex-grow overflow-y-auto'
									ref={MessageContainerRef}
								>
									{messages.map((msg, i) => {
										let extraClasses;
										if (msg.sender == user?._id) {
											extraClasses =
												'bg-blue-500 text-white ml-auto rounded-br-none ';
										} else {
											extraClasses =
												'bg-gray-200 rounded-bl-none';
										}

										return (
											<div
												className={
													'rounded-md w-fit max-w-lg px-4 py-2 ' +
													extraClasses
												}
												key={i}
											>
												{msg.message}
											</div>
										);
									})}
								</div>

								<div className='flex items-center gap-2'>
									<input
										placeholder='Write a message...'
										type='text'
										className='flex-grow h-10 px-4 rounded-md'
									/>
									<button className='bg-blue-500 h-10 w-10 rounded-md'>
										<FontAwesomeIcon
											className='text-white'
											icon={faPaperPlane}
										/>
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</MainNavBar>
	);
}
