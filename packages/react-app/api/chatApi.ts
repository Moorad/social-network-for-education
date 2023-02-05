import { baseApi } from './base';

export const chatContacts = async () => {
	const response = await baseApi.get('/chat/contacts');
	return response.data;
};
