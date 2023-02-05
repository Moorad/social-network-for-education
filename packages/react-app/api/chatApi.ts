import { baseApi } from './base';

export const chatContacts = async () => {
	const response = await baseApi.get('/chat/contacts');
	return response.data;
};

export const chatMessages = async ({ chatId }: { chatId: string }) => {
	const response = await baseApi.get(`/chat/messages?chatId=${chatId}`);
	return response.data;
};
