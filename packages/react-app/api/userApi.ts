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

export const uploadAnyFile = async (data: { formData: FormData }) => {
	const response = await baseApi.post(
		'resource/upload_attachment',
		data.formData,
		{
			data: data.formData,
		}
	);

	return response.data;
};

export const userFeed = async ({ pageParam = 0 }: { pageParam?: number }) => {
	const response = await baseApi.get(
		`/user/feed?type=following&skip=${pageParam}&limit=10`
	);
	return response.data;
};

export const getUserEmail = async () => {
	const response = await baseApi.get('/user/email');
	return response.data;
};

export const updateUserProfile = async (data: {
	avatar?: string;
	background?: string;
	displayName?: string;
	description?: string;
	label?: string;
	isPrivate?: boolean;
}) => {
	const response = await baseApi.post('/user/update/profile', data);
	return response.data;
};

export const updateUserAccount = async (data: {
	email?: string;
	strategy?: string;
	password?: string;
}) => {
	const response = await baseApi.post('/user/update/account', data);
	return response.data;
};
