import { DateTime, Settings } from "luxon";
import { dateDiff, isMonthDayLocale, parseDate } from "../src/dates";
import { localeNumber } from "../src/helpers";

const TEST_LOCALES = [
	{
		locale: 'en-US',
		isMonthFirst: true,
		mondayLong: 'monday',
		mondayShort: 'mon',
		sundayLongCapital: 'Sunday',
	},
	{
		locale: 'fr-FR',
		isMonthFirst: false,
		mondayLong: 'lundi',
		mondayShort: 'lun',
		sundayLongCapital: 'Dimanche',
	},
];

const now = DateTime.local();
const fifthOfApril2022ISO = DateTime.fromObject({ year: 2022, month: 4, day: 5 }).toISODate();
const fifthOfAprilISO = DateTime.fromObject({ year: now.year, month: 4, day: 5 }).toISODate();
const fifthISO = DateTime.fromObject({ year: now.year, month: now.month, day: 5 }).toISODate();

const NATURAL_DATES_TESTS = {
	MONTH_FIRST: [
		{ input: "04/05/2022", iso: fifthOfApril2022ISO },
		{ input: "04-05-2022", iso: fifthOfApril2022ISO },
		{ input: "4/5/22", iso: fifthOfApril2022ISO },
		{ input: "4/5", iso: fifthOfAprilISO },
		{ input: "5", iso: fifthISO },
	],
	DAY_FIRST: [
		{ input: "05/04/2022", iso: fifthOfApril2022ISO },
		{ input: "05-04-2022", iso: fifthOfApril2022ISO },
		{ input: "5/4/22", iso: fifthOfApril2022ISO },
		{ input: "5/4", iso: fifthOfAprilISO },
		{ input: "5", iso: fifthISO },
	],
};

const DATEDIFF_TESTS = [
	{ from: "2022-04-01", to: "2022-04-01", unit: "d", expected: "0 day" },
	{ from: "2022-04-01", to: "2022-04-01", unit: "m", expected: "0 month" },
	{ from: "2022-04-01", to: "2022-04-01", unit: "y", expected: "0 year" },
	{ from: "2022-04-01", to: "2022-04-01", unit: "", expected: "0 day" },

	{ from: "2022-04-01", to: "2022-04-02", unit: "d", expected: "1 day", reverse: true },
	{ from: "2022-04-01", to: "2022-04-02", unit: "m", expected: `${localeNumber(0.033)} month`, reverse: true },
	{ from: "2022-04-01", to: "2022-04-02", unit: "y", expected: `${localeNumber(0.003)} year`, reverse: true },
	{ from: "2022-04-01", to: "2022-04-02", unit: "", expected: "1 day", reverse: true },

	{ from: "2022-04-01", to: "2022-05-01", unit: "d", expected: "30 days", reverse: true },
	{ from: "2022-04-01", to: "2022-05-01", unit: "m", expected: "1 month", reverse: true },
	{ from: "2022-04-01", to: "2022-05-01", unit: "y", expected: `${localeNumber(0.082)} year`, reverse: true },
	{ from: "2022-04-01", to: "2022-05-01", unit: "", expected: "1 month", reverse: true },

	{ from: "2022-04-01", to: "2022-05-02", unit: "d", expected: "31 days", reverse: true },
	{ from: "2022-04-01", to: "2022-05-02", unit: "m", expected: `${localeNumber(1.032)} month`, reverse: true },
	{ from: "2022-04-01", to: "2022-05-02", unit: "y", expected: `${localeNumber(0.085)} year`, reverse: true },
	{ from: "2022-04-01", to: "2022-05-02", unit: "", expected: "1 month 1 day", reverse: true },

	{ from: "2022-04-01", to: "2024-05-02", unit: "d", expected: "762 days", reverse: true },
	{ from: "2022-04-01", to: "2024-05-02", unit: "m", expected: `${localeNumber(25.032)} months`, reverse: true },
	{ from: "2022-04-01", to: "2024-05-02", unit: "y", expected: `${localeNumber(2.085)} years`, reverse: true },
	{ from: "2022-04-01", to: "2024-05-02", unit: "", expected: "2 years 1 month 1 day", reverse: true },
	{ from: "2022-04-01", to: "2024-05-02", unit: "", expected: "2 years 1 month 1 day", reverse: true },
];

for (const locale of TEST_LOCALES) {

	describe(`=== ${locale.locale} ===`, () => {

		beforeAll(() => {
			Settings.defaultLocale = locale.locale;
		});

		// =======================================================
		// == isMonthDayLocale()
		// =======================================================

		describe("isMonthDayLocale()...", () => {
			test(`should be ${locale.isMonthFirst}`, () => {
				expect(isMonthDayLocale()).toBe(locale.isMonthFirst);
			});
		});

		// =======================================================
		// == parseDate()
		// =======================================================

		describe("parseDate()...", () => {

			test("should not parse 'aziheazomehaz'", () => {
				const result = parseDate("aziheazomehaz");
				expect(result).toBe(null);
			});

			test("should parse 'today'", () => {
				const today = DateTime.local();
				const result = parseDate("today");
				expect(today.toISODate()).toBe(result.toISODate());
			});

			// -------------------------------------------------------
			// -- Weekdays
			// -------------------------------------------------------

			describe("should parse weekdays...", () => {
				test(`should parse '${locale.mondayLong}'`, () => {
					const monday = DateTime.local().startOf("week");
					const result = parseDate(locale.mondayLong);
					expect(monday.toISODate()).toBe(result.toISODate());
				});
				test(`should parse '${locale.mondayShort}'`, () => {
					const monday = DateTime.local().startOf("week");
					const result = parseDate(locale.mondayShort);
					expect(monday.toISODate()).toBe(result.toISODate());
				});
				test(`should parse '${locale.sundayLongCapital}'`, () => {
					const monday = DateTime.local().endOf("week");
					const result = parseDate(locale.sundayLongCapital);
					expect(monday.toISODate()).toBe(result.toISODate());
				});
			});

			// -------------------------------------------------------
			// -- ISO Dates
			// -------------------------------------------------------

			describe("should parse ISO dates...", () => {
				test("should parse '2022-04-15'", () => {
					const result = parseDate("2022-04-15");
					expect(result.toISODate()).toBe("2022-04-15");
				});
				test("should parse '2022-04'", () => {
					const result = parseDate("2022-04");
					expect(result.toISODate()).toBe("2022-04-01");
				});
				test("should parse '2022'", () => {
					const result = parseDate("2022");
					expect(result.toISODate()).toBe("2022-01-01");
				});
			});

			// -------------------------------------------------------
			// -- DD/MM/YYYY and MM/DD/YYYY
			// -------------------------------------------------------

			if (locale.isMonthFirst) {
				describe("should parse MM/DD/YYYY...", () => {
					NATURAL_DATES_TESTS.MONTH_FIRST.forEach(testCase => {
						test(`should parse '${testCase.input}' as ${testCase.iso}`, () => {
							const result = parseDate(testCase.input);
							expect(result.toISODate()).toBe(testCase.iso);
						});
					});
				});
			}
			else {
				describe("should parse DD/MM/YYYY...", () => {
					NATURAL_DATES_TESTS.DAY_FIRST.forEach(testCase => {
						test(`should parse '${testCase.input}' as ${testCase.iso}`, () => {
							const result = parseDate(testCase.input);
							expect(result.toISODate()).toBe(testCase.iso);
						});
					});
				});
			}
		});

		// =======================================================
		// == dateDiff()
		// =======================================================

		describe("dateDiff()...", () => {

			DATEDIFF_TESTS.forEach(testCase => {

				test(`should return '${testCase.expected}' for ${testCase.from} to ${testCase.to} in ${testCase.unit}`, () => {
					const result = dateDiff(
						DateTime.fromISO(testCase.from),
						DateTime.fromISO(testCase.to),
						testCase.unit
					);
					expect(result).toBe(testCase.expected);
				});

				const sign = testCase.reverse ? "- " : "";

				test(`should return '${sign}${testCase.expected}' for ${testCase.to} to ${testCase.from} in ${testCase.unit}`, () => {
					const result = dateDiff(
						DateTime.fromISO(testCase.to),
						DateTime.fromISO(testCase.from),
						testCase.unit
					);
					expect(result).toBe(sign + testCase.expected);
				});

			});
		});

	});
}
