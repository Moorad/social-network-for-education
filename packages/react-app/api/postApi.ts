import { baseApi } from './base';

export const likePost = async (postId: string) => {
	const response = await baseApi.get(`/post/like?postId=${postId}`);
	return response.data;
};

export const getPost = async (postId: string) => {
	const response = await baseApi.get(`/post?id=${postId}`);
	return response.data;
};

export const getPostComments = async (postId: string) => {
	const response = await baseApi.get(`/post/comments?postId=${postId}`);
	return response.data;
};

export const viewedPost = async (postId: string) => {
	const response = await baseApi.get(`/post/view?postId=${postId}`);
	return response.data;
};

export const commentOnPost = async ({
	postId,
	content,
}: {
	postId?: string;
	content?: string;
}) => {
	const response = await baseApi.post(`/post/comment?postId=${postId}`, {
		content: content,
	});
	return response.data;
};
