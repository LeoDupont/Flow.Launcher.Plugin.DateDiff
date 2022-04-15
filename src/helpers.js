
export function localeNumber(number) {
	return number.toLocaleString({
		maximumSignificantDigits: 3,
	});
}
