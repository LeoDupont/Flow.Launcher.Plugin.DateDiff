import { Config } from "./config.js";
import { dateDiff, displayDate, parseDate, UNITS } from "./dates.js";

/**
 * - Parses the query in the form `<fromDate?> <toDate> <unit?>`
 * - `<fromDate>` is optional, default is today
 * - `<unit>` is optional, default is a mix of years + months + days
 *
 * @param {string} parameters
 */
export function query(parameters) {

	// === Parsing parameters ===

	let fromDate, toDate, unit;

	const args = parameters.split(" ");

	switch (args.length) {

		/**
		 * 1 argument:
		 * => `<TODAY> <toDate> <DEFAULT_UNIT>`
		 */
		case 1:
			fromDate = parseDate("today");
			toDate = parseDate(args[0]);
			break;

		/**
		 * 2 arguments:
		 * => `<fromDate> <toDate> <DEFAULT_UNIT>` OR
		 * => `<TODAY> <toDate> <unit>`
		 */
		case 2:
			if (Object.keys(UNITS).includes(args[1])) {
				fromDate = parseDate("today");
				toDate = parseDate(args[0]);
				unit = args[1];
			}
			else {
				fromDate = parseDate(args[0]);
				toDate = parseDate(args[1]);
			}
			break;

		/**
		 * 3 arguments:
		 * => `<fromDate> <toDate> <unit>`
		 */
		case 3:
			fromDate = parseDate(args[0]);
			toDate = parseDate(args[1]);
			unit = args[2];
			break;

		default:
			return sendResult();
	}

	if (!fromDate || !toDate) {
		return sendResult();
	}

	const dateDiffStr = dateDiff(fromDate, toDate, unit);

	sendResult([{
		Title: dateDiffStr,
		SubTitle: `From ${displayDate(fromDate)} to ${displayDate(toDate)}`,
		IcoPath: Config.iconPath,
		score: 0,
	}]);
}

function sendResult(result = []) {
	console.log(JSON.stringify({ result }));
}
