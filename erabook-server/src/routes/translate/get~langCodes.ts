import { Context } from "hono";
import { languageList } from "lingva-scraper";

export default async (c: Context) =>
	c.json({
		status: 200,
		message: "OK",
		data: languageList,
	});
