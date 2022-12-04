import { baseApi } from './base';

export const searchQuery = async (query: string) => {
	const response = await baseApi.get(`/utils/search?term=${query}`);
	return response.data;
};
