import { faMessage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MessageType } from 'node-server/Models/Chat';
import { UserMinimal } from 'node-server/Models/User';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { io, Socket } from 'socket.io-client';
import { chatContacts, chatMessages } from '../../api/chatApi';
import Loading from '../../components/Loading';
import MainNavBar from '../../components/NavBars/MainNavBar';
import useAuth from '../../utils/hooks/useAuth';

export default function index() {
	const { fetching, user } = useAuth();
	const [selectedUser, setSelectedUser] = useState<{
		chatId: string;
		user: UserMinimal;
		index: number;
	} | null>(null);
	const [contacts, setContacts] = useState<
		{
			chatId: string;
			type: 'direct' | 'group';
			user: UserMinimal;
			lastMessage: MessageType;
		}[]
	>([]);
	const [messages, setMessages] = useState<MessageType[]>([]);
	const messageContainerRef = useRef<HTMLDivElement>(null);
	const messageInputRef = useRef<HTMLInputElement>(null);
	const messagesMutation = useMutation('messages', chatMessages, {
		onSuccess: (res) => {
			setMessages(res);
		},
	});
	useQuery('contacts', chatContacts, {
		onSuccess: (res) => {
			setContacts(res);
		},
	});
	const socket = useRef<Socket | null>(null);

	useEffect(() => {
		if (selectedUser) {
			messagesMutation.mutate({ chatId: selectedUser.chatId });

			// Creating web socket connection
			socket.current = io(process.env.NEXT_PUBLIC_API_URL as string, {
				autoConnect: true,
			});
			socket.current.emit('set_user', user?._id);
		}
	}, [selectedUser]);

	useEffect(() => {
		messageContainerRef.current?.scroll({
			top: messageContainerRef.current?.scrollHeight,
		});

		setContacts(
			contacts.map((contact) => {
				if (contact.chatId == selectedUser?.chatId) {
					return {
						...contact,
						lastMessage: messages[messages.length - 1],
					};
				}

				return contact;
			})
		);
	}, [messages]);

	useEffect(() => {
		if (socket.current) {
			socket.current.on('receive_message', (payload: MessageType) => {
				console.log(payload);
				console.log(messages);
				setMessages([...messages, payload]);
			});
		}
	}, [messages]);

	function handleSubmitMessage(event: FormEvent) {
		event.preventDefault();
		if (messageInputRef.current && socket.current) {
			socket.current.emit('send_message', {
				chatId: selectedUser?.chatId,
				message: messageInputRef.current.value,
				to: selectedUser?.user._id,
				from: user?._id,
			});

			if (user) {
				setMessages([
					...messages,
					{
						message: messageInputRef.current.value,
						sender: user._id,
						timestamp: new Date().toISOString(),
					},
				]);
			}

			messageInputRef.current.value = '';
		}
	}

	function renderContactList() {
		return contacts.map((contact, i) => {
			return (
				<button
					key={i}
					className={
						'flex py-2 px-3 gap-4 text-left hover:bg-gray-100 w-full ' +
						(selectedUser && selectedUser.index == i
							? 'bg-gray-100'
							: '')
					}
					onClick={() =>
						setSelectedUser({
							chatId: contact.chatId,
							user: contact.user,
							index: i,
						})
					}
				>
					<div className='my-auto'>
						<div className='h-12 w-12'>
							<img
								src={contact.user.avatar}
								className=' rounded-full object'
							/>
						</div>
					</div>
					<div className='flex flex-col w-full'>
						<div className='flex justify-between'>
							<div className='font-semibold'>
								{contact.user.displayName}
							</div>
							{contact.lastMessage && (
								<div className='text-xs font-semibold text-gray-500'>
									{new Date(
										contact.lastMessage.timestamp
									).getHours()}
									:
									{new Date(
										contact.lastMessage.timestamp
									).getMinutes()}
								</div>
							)}
						</div>
						<div className='text-sm text-gray-500 overflow-clip'>
							{contact.lastMessage.message}
						</div>
					</div>
				</button>
			);
		});
	}

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
						{renderContactList()}
					</div>
				</div>
				<div className='flex-grow p-2'>
					<div className='bg-gray-100 rounded-xl w-full h-full '>
						{selectedUser == null && (
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

						{selectedUser && (
							<div className='flex flex-col px-2 py-2 h-full gap-4'>
								<div className='flex items-center gap-5 bg-white rounded-xl p-2'>
									<div className='h-10 w-10'>
										<img
											src={selectedUser.user.avatar}
											className=' rounded-full object'
										/>
									</div>
									<div className='font-bold'>
										{selectedUser.user.displayName}
									</div>
								</div>

								<div
									className='flex flex-col gap-2 justify-items-center flex-grow overflow-y-auto'
									ref={messageContainerRef}
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

								<form
									className='flex items-center gap-2'
									onSubmit={(e) => handleSubmitMessage(e)}
								>
									<input
										placeholder='Write a message...'
										type='text'
										className='flex-grow h-10 px-4 rounded-md'
										ref={messageInputRef}
									/>
									<button className='bg-blue-500 h-10 w-10 rounded-md'>
										<FontAwesomeIcon
											className='text-white'
											icon={faPaperPlane}
										/>
									</button>
								</form>
							</div>
						)}
					</div>
				</div>
			</div>
		</MainNavBar>
	);
}
