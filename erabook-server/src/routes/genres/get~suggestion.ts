import { Context } from "hono";
import { Document } from "mongodb";
import { BWGenre } from "../../models/index.js";
import { BWDatabase } from "../../modules/database/index.js";

export default async (c: Context) => {
	const condition: Document[] = [
		{ $project: { _id: 1, name: 1, description: 1 } },
	];

	const querySearch = c.req.query("s") || c.req.query("search");
	if (querySearch) {
		condition.unshift({
			$match: { name: { $regex: new RegExp(querySearch, "i") } },
		});
	}

	const entries =
		await BWDatabase.tables.BWGenres.aggregate<BWGenre>(condition).toArray();

	return c.json({
		status: 200,
		message: "OK",
		data: entries,
	});
};
