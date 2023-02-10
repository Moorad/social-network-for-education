import { baseApi } from './base';

export const searchQuery = async (query: string) => {
	const response = await baseApi.get(`/utils/search?term=${query}`);
	return response.data;
};

export const referenceQuery = async (query: string) => {
	const response = await baseApi.get(`/utils/search_reference?term=${query}`);
	return response.data;
};

export const clearNotificationsRequest = async () => {
	const response = await baseApi.get('/utils/clear_notifications');
	return response.data;
};
