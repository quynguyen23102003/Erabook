import { readFileSync } from "fs";
import { resolve } from "path";

const __FILTER_LIST: string[] = [];
const loadFilterList = () => {
	for (const line of readFileSync(
		`${resolve("./")}/data/profanity_vi.txt`,
		"utf-8",
	).split("\n")) {
		if (!line.startsWith("#") && line.length > 0) __FILTER_LIST.push(line);
	}
};

const check = (input: string): boolean => {
	if (__FILTER_LIST.length === 0) loadFilterList();

	console.info(
		__FILTER_LIST.filter((entry) => new RegExp(entry, "gi").test(input)),
	);
	return __FILTER_LIST.some((entry) => new RegExp(entry, "gi").test(input));
};

const filter = (input: string): string => {
	if (__FILTER_LIST.length === 0) loadFilterList();

	return __FILTER_LIST.reduce(
		(replacement, entry) => replacement.replace(new RegExp(entry, "gi"), "***"),
		input,
	);
};

export { check as profanityCheck, filter as profanityFilter };
