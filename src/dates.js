import { DateTime, Info } from "luxon";
import { localeNumber } from "./helpers.js";

export const UNITS = {
	d: "days",
	m: "months",
	y: "years",
}

/**
 * Determines whether current locales prints dates in the format `MM/DD/YYYY`.
 */
export function isMonthDayLocale() {
	const dt = DateTime.fromObject({ month: 12, day: 1, year: 2022 });
	const dateStr = dt.toLocaleString(DateTime.DATE_SHORT);
	return (dateStr.indexOf("12") === 0);
}

export function parseDate(inputStr) {

	const WEEKDAYS = Info.weekdays("long").map(day => day.toLowerCase());
	const IS_MONTH_FIRST = isMonthDayLocale();

	const str = inputStr.toLowerCase();

	const now = DateTime.local();
	const today = DateTime.fromObject({ year: now.year, month: now.month, day: now.day });
	let dt;

	// today:
	if (str === "today") {
		return today;
	}

	// weekday:
	const weekday = WEEKDAYS.find(w => w.startsWith(str));
	if (weekday) {
		dt = today.plus({ days: WEEKDAYS.indexOf(weekday) - today.weekday + 1 });
		return dt;
	}

	// ISO (YYYY-MM-DD):
	if (str.match(/^\d{4}(-\d{2})?(-\d{2})?$/)) {
		dt = DateTime.fromISO(str);
		if (dt.isValid) { return dt; }
	}

	// DD/MM/YYYY (or MM/DD/YYYY if en-US):
	// (with optional MM and YYYY)
	// (with `/` or `-` as separators)

	const parts = str.split(/[/-]/).map(s => parseInt(s, 10));

	let day, month, year;

	switch (parts.length) {
		case 3:
			year = parts[2];
			month = parts[IS_MONTH_FIRST ? 0 : 1];
			day = parts[IS_MONTH_FIRST ? 1 : 0];
			break;

		case 2:
			year = today.year;
			month = parts[IS_MONTH_FIRST ? 0 : 1];
			day = parts[IS_MONTH_FIRST ? 1 : 0];
			break;

		case 1:
			year = today.year;
			month = today.month;
			day = parts[0];
			break;

		default:
			return null;
	}

	if (isNaN(year) || isNaN(month) || isNaN(day)) {
		return null;
	}

	// Year 0 to 99 => 2000 to 2099:
	if (year < 100) { year += 2000; }

	dt = DateTime.fromObject({ day, month, year });
	if (dt.isValid) { return dt; }

	return null;
}

export function displayDate(dt) {
	return dt.toLocaleString(DateTime.DATE_FULL);
}

export function dateDiff(date1, date2, unit) {

	// === Sign of the difference ===

	let from, to, sign;
	if (date1 <= date2) {
		from = date1;
		to = date2;
		sign = "";
	}
	else {
		from = date2;
		to = date1;
		sign = "- ";
	}

	// === Given unit ===

	if (unit) {
		let unitStr = UNITS[unit];
		const diff = to.diff(from, unitStr)[unitStr];

		if (Math.abs(diff) < 2) {
			// Dropping the 's':
			unitStr = unitStr.substr(0, unitStr.length - 1);
		}

		return `${sign}${localeNumber(diff)} ${unitStr}`;
	}

	// === No given unit ===
	// (mix of years + months + days)

	let yearsDiff, monthsDiff, daysDiff;

	yearsDiff = Math.floor(to.diff(from, "years").years);
	to = to.plus({ years: -yearsDiff });

	monthsDiff = Math.floor(to.diff(from, "months").months);
	to = to.plus({ months: -monthsDiff });

	daysDiff = Math.floor(to.diff(from, "days").days);

	const parts = [];
	if (yearsDiff > 0) { parts.push(`${yearsDiff} year${yearsDiff > 1 ? "s" : ""}`); }
	if (monthsDiff > 0) { parts.push(`${monthsDiff} month${monthsDiff > 1 ? "s" : ""}`); }
	if (daysDiff > 0) { parts.push(`${daysDiff} day${daysDiff > 1 ? "s" : ""}`); }

	if (yearsDiff === 0 && monthsDiff === 0 && daysDiff === 0) {
		return "0 day";
	}

	return `${sign}${parts.join(" ")}`;
}
