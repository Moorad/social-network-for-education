import { Socket } from 'socket.io-client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import useAuth from '../utils/hooks/useAuth';

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	const { user } = useAuth(false);

	useEffect(() => {
		setSocket(io(process.env.NEXT_PUBLIC_API_URL as string));
	}, []);

	useEffect(() => {
		if (user && socket) {
			socket.emit('set_user', user._id);

			socket.on('error', (err) => {
				console.log('Socket Error:', err.message);
			});
		}
	}, [user, socket]);

	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	);
};

export const useSocket = () => useContext(SocketContext);
