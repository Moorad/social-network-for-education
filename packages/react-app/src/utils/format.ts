const precision = 2;

export function formatNumber(unformattedNumber: number) {
	const suffix = ['K', 'M', 'B'];
	for (let i = suffix.length - 1; i >= 0; i--) {
		if (unformattedNumber >= 10 ** ((i + 1) * 3)) {
			unformattedNumber =
				Number(unformattedNumber.toPrecision(precision)) /
				10 ** ((i + 1) * 3);
			const numSplit = String(unformattedNumber).split('.');
			const dp = precision - numSplit[0].length;
			return unformattedNumber.toFixed(dp) + suffix[i];
		}
	}

	return String(unformattedNumber);
}
