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

	const args = parameters.trim().split(" ");

	switch (args.length) {

		/**
		 * 1 argument:
		 * => `<TODAY> <toDate> <DEFAULT_UNIT>`
		 */
		case 1:
			if (!args[0]) { return sendResult(); }
			fromDate = parseDate("today");
			toDate = parseDate(args[0]);
			break;

		/**
		 * 2 arguments:
		 * => `<fromDate> <toDate> <DEFAULT_UNIT>` OR
		 * => `<TODAY> <toDate> <unit>`
		 */
		case 2:
			if (!args[0] || !args[1]) { return sendResult(); }
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
			if (!args[0] || !args[1] || !args[2]) { return sendResult(); }
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
		IcoPath: Config.IcoPath,
		score: 100,
	}]);

	return dateDiffStr;
}

function sendResult(result = []) {
	result.push(getHelpResult());
	console.log(JSON.stringify({ result }));
}

function getHelpResult() {
	return {
		Title: "DateDiff usage: <fromDate?> <toDate> <unit?>",
		SubTitle: "Click to open documentation",
		IcoPath: Config.IcoPath,
		jsonRPCAction: {
			method: "open_datediff_url",
			parameters: [Config.DocUrl],
		},
		score: 0,
	}
}
