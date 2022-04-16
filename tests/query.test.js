import { localeNumber } from "../src/helpers";
import { query } from "../src/query";

const QUERY_TESTS = [
	{ input: "", expected: undefined },
	{ input: "lknaln", expected: undefined },
	{ input: "lknaln ùazen", expected: undefined },
	{ input: "lknaln 2022-05-01", expected: undefined },
	{ input: "lknaln 2022-05-01 m", expected: undefined },
	{ input: "today", expected: "0 day" },
	{ input: "today d", expected: "0 day" },
	{ input: "2022-04-01 2022-05-02", expected: "1 month 1 day" },
	{ input: "2022-04-01 2022-05-02 m", expected: `${localeNumber(1.032)} month` },
];

describe("query()...", () => {

	QUERY_TESTS.forEach(test => {
		it(`should return '${test.expected}' for '${test.input}'`, () => {
			const result = query(test.input);
			expect(result).toBe(test.expected);
		});
	});

});
