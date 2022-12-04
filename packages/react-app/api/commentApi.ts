import { baseApi } from './base';

export const likeComment = async (commentId: string) => {
	const response = await baseApi.get(`/comment/like?commentId=${commentId}`);
	return response.data;
};

export const replyToComment = async ({
	commentId,
	content,
}: {
	commentId?: string;
	content?: string;
}) => {
	const response = await baseApi.post(
		`/comment/reply?commentId=${commentId}`,
		{
			content: content,
		}
	);
	return response.data;
};
