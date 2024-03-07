import { Context } from "hono";
import { Document } from "mongodb";
import { BWGenre } from "../../models/index.js";
import { BWDatabase } from "../../modules/database/index.js";
import { SessionManager } from "../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async () => {
		const condition: Document[] = [
			{
				$lookup: {
					from: "BWBooks",
					let: { gid: "$_id" },
					as: "coverImage",
					pipeline: [
						{
							$match: {
								$expr: {
									$or: [
										{ $in: ["$$gid", "$_genreIds"] },
										{ $in: [{ $toString: "$$gid" }, "$_genreIds"] },
									],
								},
							},
						},
						{
							$sample: { size: 1 },
						},
						{
							$project: {
								coverImage: 1,
							},
						},
					],
				},
			},
			{
				$set: {
					coverImage: {
						$arrayElemAt: ["$coverImage", 0],
					},
				},
			},
			{
				$set: {
					coverImage: "$coverImage.coverImage",
				},
			},
		];

		const querySearch = c.req.query("s") || c.req.query("search");
		if (querySearch) {
			condition.unshift({
				$match: {
					name: {
						$regex: new RegExp(querySearch, "i"),
					},
				},
			});
		}

		const entries =
			await BWDatabase.tables.BWGenres.aggregate<BWGenre>(condition).toArray();

		return c.json({
			status: 200,
			message: "OK",
			data: entries,
		});
	});
