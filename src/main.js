import open from "open";
import { query } from "./query.js";

const { method, parameters } = JSON.parse(process.argv[2]);

switch (method) {

	case "query":
		query(parameters[0]);
		break;

	case "open_datediff_url":
		open(parameters[0]);
		break;
}
