import { baseApi } from './base';

export const logoutUser = async () => {
	const response = await baseApi.get('/auth/logout');
	return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
	const response = await baseApi.post('/auth/login', data);
	return response.data;
};
