export function getWordCount(text: string) {
	return (text.split(/\s+/) || ['']).length;
}

// Based on Flesch–Kincaid readability tests
// https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests
export function getReadingLevel(text: string) {
	const words = text.split(/\s+/) || [''];

	const syllables = words.reduce((prev, curr) => {
		curr = curr.toLowerCase();
		curr = curr.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');
		curr = curr.replace(/^y/, '');
		const syl = curr.match(/[aeiouy]{1,2}/g);
		if (syl) {
			return prev + syl.length;
		}

		return prev;
	}, 0);

	const wordCount = words.length;

	const sentences = text
		.trim()
		.split(/[.!?\n]/g)
		.filter((e) => e != '').length;

	// Value is clamped between 0 and 100
	const FRES = Math.min(
		Math.max(
			206.835 -
				1.015 * (wordCount / sentences) -
				84.6 * (syllables / wordCount),
			0
		),
		100
	);
	if (FRES > 90) {
		return `(${Math.floor(FRES)}) Very easy to read.`;
	} else if (FRES > 80) {
		return `(${Math.floor(FRES)}) Easy to read.`;
	} else if (FRES > 70) {
		return `(${Math.floor(FRES)}) Fairly easy to read.`;
	} else if (FRES > 60) {
		return `(${Math.floor(FRES)}) Plain English.`;
	} else if (FRES > 50) {
		return `(${Math.floor(FRES)}) Fairly difficult to read.`;
	} else if (FRES > 30) {
		return `(${Math.floor(FRES)}) Difficult to read.`;
	} else if (FRES > 10) {
		return `(${Math.floor(FRES)}) Very difficult to read.`;
	} else {
		return `(${Math.floor(FRES)}) Extremely difficult to read.`;
	}
}
