export function formatNumber(unformattedNumber: number) {
	return Intl.NumberFormat('en-US', {
		notation: 'compact',
		maximumSignificantDigits: 2,
	}).format(unformattedNumber);
}

export function formatDigitGrouping(unformattedNumber: number) {
	return Intl.NumberFormat('en-US').format(unformattedNumber);
}

export function formatToRelativeTime(date: Date) {
	const timeDiff = Math.floor(
		(new Date().getTime() - new Date(date).getTime()) / 1000
	);
	const minute = 60;
	const hour = minute * 60;
	const day = hour * 24;
	const month = day * 30;

	const formatter = new Intl.RelativeTimeFormat('en', { style: 'narrow' });

	// Less than 30 secs
	if (timeDiff < 30) {
		return 'just now';
	}

	// Less than 60 secs
	if (timeDiff < minute) {
		return formatter.format(-timeDiff, 'second');
	}

	// Less than 60 mins
	if (timeDiff < hour) {
		return formatter.format(-Math.floor(timeDiff / minute), 'minute');
	}

	// Less than 24 hrs
	if (timeDiff < day) {
		return formatter.format(-Math.floor(timeDiff / hour), 'hour');
	}

	// Less than 30 days
	if (timeDiff < month) {
		return formatter.format(-Math.floor(timeDiff / day), 'day');
	}

	return formatter.format(-Math.floor(timeDiff / month), 'month');
}
