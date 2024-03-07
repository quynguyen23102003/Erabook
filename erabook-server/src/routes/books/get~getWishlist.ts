import { Context } from "hono";
import { Document } from "mongodb";
import { ActivityLogManager } from "../../modules/activityLog/index.js";
import { BWDatabase } from "../../modules/database/index.js";
import {
	MongoBookConditions,
	MongoPaginationConditions,
	MongoUserConditions,
} from "../../modules/mongo/index.js";
import { SessionManager } from "../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		let queryPage =
			Number(c.req.query("p")) || Number(c.req.query("page")) || 1;
		if (queryPage < 0) queryPage = 1;
		let queryLimit = Number(c.req.query("limit")) || 50;
		if (queryLimit < 0) queryLimit = 50;

		const querySearch = c.req.query("s") || c.req.query("search");
		const queryGenre = c.req.query("g") || c.req.query("genre");
		const querySort = c.req.query("z") || c.req.query("sort");
		const querySortOrder = c.req.query("asc") ? 1 : -1;

		const condition: Document[] = [
			{
				$match: {
					$expr: {
						$in: [
							{ $toString: "$_id" },
							user.wishlist?.map((b) => b.bookId.toString()) ?? [],
						],
					},
				},
			},
			...MongoBookConditions.bookBaseCondition,
			...MongoBookConditions.bookGetChapterCount,
			...MongoBookConditions.bookGetAuthor,
			...MongoBookConditions.bookGetGenres,
			...MongoBookConditions.bookGetPageCount,
			...MongoBookConditions.bookGetPurchaseCount,
			...MongoBookConditions.bookGetRatingInfo,
			...MongoUserConditions.userGetPurchaseState(user),
			...MongoUserConditions.userGetReadingState(user),
			...MongoUserConditions.userGetWishlistState(user),
		];

		if (querySearch) {
			condition.unshift({
				$match: {
					title: {
						$regex: new RegExp(querySearch, "i"),
					},
				},
			});
		}

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

		if (querySort) {
			switch (querySort) {
				case "lastUpdated": {
					condition.push({
						$sort: {
							lastUpdated: querySortOrder,
						},
					});
					break;
				}
				case "title": {
					condition.push({
						$sort: {
							title: querySortOrder,
						},
					});
					break;
				}
				case "releaseDate": {
					condition.push({
						$sort: {
							releaseDate: querySortOrder,
						},
					});
					break;
				}
				case "viewCount": {
					condition.push({
						$sort: {
							viewCount: querySortOrder,
						},
					});
					break;
				}
				case "price": {
					condition.push({
						$sort: {
							price: querySortOrder,
						},
					});
					break;
				}
				default: {
					condition.push({
						$sort: {
							title: querySortOrder,
						},
					});
				}
			}
		}

		const queryFilter = c.req.query("f") || c.req.query("filter") || undefined;
		const parseExpr = (
			field: unknown,
			value: string | number,
			comparator: string,
		) => {
			if (comparator.includes("<")) {
				if (comparator.includes("=")) return { $lte: [field, value] };
				return { $lt: [field, value] };
			}
			if (comparator.includes(">")) {
				if (comparator.includes("=")) return { $gte: [field, value] };
				return { $gt: [field, value] };
			}
			if (comparator.replaceAll(new RegExp("=+", "g"), "=") === "=") {
				return { $eq: [field, value] };
			}
		};
		for (const filter of queryFilter?.split(",") || []) {
			const params = filter
				.split(new RegExp("[<>=]", "g"))
				.filter((f) => f.length > 0);

			const option = params.at(0);
			const value = Number(params.at(1));
			const comparator = filter.replaceAll(
				new RegExp(`${option}|${value}`, "g"),
				"",
			);

			switch (option) {
				case "price":
					condition.push({
						$match: {
							$expr: parseExpr({ $toDouble: "$price" }, value, comparator),
						},
					});
					break;
				case "rating":
					condition.push({
						$match: {
							$expr: parseExpr(
								{ $toDouble: "$rating.average" },
								value,
								comparator,
							),
						},
					});
					break;
				case "pageCount":
					condition.push({
						$match: {
							$expr: parseExpr({ $toInt: "$pageCount" }, value, comparator),
						},
					});
					break;
				case "purchaseCount":
					condition.push({
						$match: {
							$expr: parseExpr({ $toInt: "$purchaseCount" }, value, comparator),
						},
					});
					break;
				default:
					break;
			}
		}

		condition.push(
			...MongoPaginationConditions.pagination(queryPage, queryLimit),
		);

		const bookEntries =
			await BWDatabase.tables.BWBooks.aggregate(condition).next();

		// track
		await ActivityLogManager.appendAction(user, null, "search.getWishlist", {
			query: querySearch,
			page: queryPage,
			genre: queryGenre,
			sortBy: querySort,
			sortOrder: querySortOrder,
			limit: queryLimit,
		});

		return c.json({
			status: 200,
			message: "OK",
			...bookEntries,
		});
	});
