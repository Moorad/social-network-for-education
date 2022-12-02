import { uploadForTypes } from '../components/User';
import { baseApi } from './base';

export const getUserMe = async () => {
	const response = await baseApi.get('/user');
	return response.data;
};

export const getUserPostsMe = async () => {
	const response = await baseApi.get('/user/posts');
	return response.data;
};

export const getUser = async (userId?: string) => {
	const response = await baseApi.get(`/user?id=${userId}`);
	return response.data;
};

export const getUserPosts = async (userId?: string) => {
	const response = await baseApi.get(`/user/posts?id=${userId}`);
	return response.data;
};

export const followUser = async (userId?: string) => {
	const response = await baseApi.get(`/user/follow?userId=${userId}`);
	return response.data;
};

export const uploadUserImage = async (data: {
	formData: FormData;
	_for: uploadForTypes;
}) => {
	const response = await baseApi.post(
		`resource/upload?for=${data._for}`,
		data.formData,
		{
			data: data.formData,
		}
	);
	return response.data;
};
