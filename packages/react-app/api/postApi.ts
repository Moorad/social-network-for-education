import { baseApi } from './base';

export const likePost = async (postId: string) => {
	const response = await baseApi.get(`/post/like?postId=${postId}`);
	return response.data;
};
