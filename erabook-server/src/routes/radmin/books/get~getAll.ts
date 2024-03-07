import { Context } from "hono";
import { Document } from "mongodb";
import { BWDatabase } from "../../../modules/database/index.js";
import { MongoPaginationConditions } from "../../../modules/mongo/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		let queryPage =
			Number(c.req.query("p")) || Number(c.req.query("page")) || 1;
		if (queryPage < 0) queryPage = 1;
		let queryLimit = Number(c.req.query("limit")) || 50;
		if (queryLimit < 0) queryLimit = 50;

		const condition: Document[] = [
			...MongoPaginationConditions.pagination(queryPage, queryLimit),
		];

		const querySearch = c.req.query("s") || c.req.query("search");
		if (querySearch) {
			condition.unshift({
				$match: {
					title: {
						$regex: new RegExp(querySearch, "i"),
					},
				},
			});
		}

		const queryGenre = c.req.query("g") || c.req.query("genre");
		if (queryGenre) {
			const genres = queryGenre.indexOf(",")
				? queryGenre.split(",")
				: [queryGenre];

			condition.unshift(
				{
					$addFields: {
						_matched: {
							$and: genres.map((g) => ({
								$in: [g, "$_genreIds"],
							})),
						},
					},
				},
				{
					$match: {
						_matched: true,
					},
				},
				{
					$unset: "_matched",
				},
			);
		}

		const querySort = c.req.query("z") || c.req.query("sort");
		const querySortOrder = c.req.query("asc") ? 1 : -1;
		switch (querySort) {
			case "price": {
				condition.unshift({
					$sort: { price: querySortOrder },
				});
				break;
			}
			case "pageCount": {
				condition.unshift({
					$sort: { pageCount: querySortOrder },
				});
				break;
			}
			case "createdAt": {
				condition.unshift({
					$sort: { createdAt: querySortOrder },
				});
				break;
			}
			case "lastUpdated": {
				condition.unshift({
					$sort: { lastUpdated: querySortOrder },
				});
				break;
			}
			case "title": {
				condition.unshift({
					$sort: { title: querySortOrder },
				});
				break;
			}
			case "viewCount": {
				condition.unshift({
					$sort: { viewCount: querySortOrder },
				});
				break;
			}
			default: {
				condition.unshift({
					$sort: { createdAt: querySortOrder },
				});
			}
		}

		const entries = await BWDatabase.tables.BWBooks.aggregate(condition).next();

		return c.json({
			status: 200,
			message: "OK",
			...entries,
		});
	});
