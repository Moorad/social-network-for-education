import { baseApi } from './base';

export const likeComment = async (commentId: string) => {
	const response = await baseApi.get(`/comment/like?commentId=${commentId}`);
	return response.data;
};
