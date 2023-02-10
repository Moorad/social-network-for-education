import { createServer } from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './index';
import { socketMessageReceived } from './routes/chat';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
mongoose.connect(process.env.DB! + process.env.DB_NAME!);

mongoose.connection.once('connected', () => {
	console.log('Database successfully connected to ' + process.env.DB);
});

const http = createServer(app);

const io = new Server(http, {
	cors: {
		origin: 'http://localhost:3000',
	},
});

export type Connection = {
	userId: string;
	socketId: string;
};

export type Room = {
	userId: string;
	chatId: string;
	socketId: string;
};

let connections: Connection[] = [];
let activeRooms: Room[] = [];

io.on('connection', (socket) => {
	console.log(`SOCKET:CONNECT ${socket.id}`);

	socket.use((event, next) => {
		console.log(
			`SOCKET:${event[0].toUpperCase()} ${socket.id} ${event
				.slice(1)
				.map((e) => JSON.stringify(e))
				.join(' ')}`
		);

		next();
	});

	socket.on('set_user', (payload) => {
		connections.push({
			userId: payload,
			socketId: socket.id,
		});
	});

	socket.on('enter_room', (payload) => {
		activeRooms.push({
			userId: payload.userId,
			socketId: socket.id,
			chatId: payload.chatId,
		});
	});

	socket.on('exit_room', () => {
		activeRooms = activeRooms.filter((r) => r.socketId != socket.id);
	});

	socket.on('send_message', (payload) =>
		socketMessageReceived(payload, connections, activeRooms, socket)
	);

	socket.on('disconnect', () => {
		console.log(`SOCKET:DISCONNECT ${socket.id}`);
		activeRooms = activeRooms.filter((r) => r.socketId != socket.id);
		connections = connections.filter((s) => s.socketId != socket.id);
	});
});

http.listen(process.env.PORT || '4000', () => {
	console.log(`Server listening on port ${process.env.PORT || '4000'}`);
});
