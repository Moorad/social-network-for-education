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
