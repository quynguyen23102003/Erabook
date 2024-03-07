import { Context } from "hono";
import { Document } from "mongodb";
import { BWAuthor } from "../../models/index.js";
import { ActivityLogManager } from "../../modules/activityLog/index.js";
import { BWDatabase } from "../../modules/database/index.js";
import { MongoPaginationConditions } from "../../modules/mongo/index.js";
import { SessionManager } from "../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		let queryPage =
			Number(c.req.query("p")) || Number(c.req.query("page")) || 1;
		if (queryPage < 0) queryPage = 1;
		let queryLimit = Number(c.req.query("limit")) || 50;
		if (queryLimit < 0) queryLimit = 50;

		const querySearch = c.req.query("s") || c.req.query("search");

		const condition: Document[] = [
			{ $project: { _firebaseRef: 0 } },
			...MongoPaginationConditions.pagination(queryPage, queryLimit),
		];

		if (querySearch) {
			condition.unshift({
				$match: {
					name: {
						$regex: new RegExp(querySearch, "i"),
					},
				},
			});
		}

		const authorEntries =
			await BWDatabase.tables.BWAuthors.aggregate<BWAuthor>(condition).next();

		// track
		await ActivityLogManager.appendAction(user, null, "authors.getAll", {
			query: querySearch,
			page: queryPage,
			limit: queryLimit,
		});

		return c.json({
			status: 200,
			message: "OK",
			...authorEntries,
		});
	});
