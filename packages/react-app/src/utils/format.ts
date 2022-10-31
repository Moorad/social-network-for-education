export function formatNumber(unformattedNumber: number) {
	return Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumSignificantDigits: 2,
	}).format(unformattedNumber);
}
