import { CommentWithUser } from '../pages/post/[post]';

// Couldn't get it to work
export function sortByDate<T extends Record<string, number | string | Date>>(
	array: Array<T>,
	property: keyof T
) {
	return array.sort(
		(a, b) =>
			new Date(b[property]).getTime() - new Date(a[property]).getTime()
	);
}

export function SortCommentsDFS(
	nodes: CommentWithUser[],
	depth = 1,
	root: string | null = null
): CommentWithUser[] {
	let elements = nodes;
	if (root != null) {
		elements = nodes.filter(
			(e) => e.parents.includes(root) && e.parents.length > 1
		);
	}

	elements = elements.filter((e) => e.parents.length == depth);
	elements.sort(
		(a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()
	);

	elements.sort((a, b) => b.likeCount - a.likeCount);

	const final = [];

	for (let i = 0; i < elements.length; i++) {
		final.push(elements[i]);
		final.push(
			...SortCommentsDFS(nodes, depth + 1, elements[i]._id as string)
		);
	}

	return final;
}
