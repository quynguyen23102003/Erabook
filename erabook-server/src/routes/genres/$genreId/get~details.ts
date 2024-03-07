import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWGenre } from "../../../models/index.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async () => {
		const genreId = c.req.param("genreId");
		if (genreId.length !== 24)
			return c.json({ status: 400, message: "Invalid ID" }, 400);

		const entry = await BWDatabase.tables.BWGenres.aggregate<BWGenre>([
			{
				$match: {
					_id: new ObjectId(genreId),
				},
			},
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
		]).next();

		return entry
			? c.json({
					status: 200,
					message: "Entry found",
					data: entry,
			  })
			: c.json(
					{
						status: 404,
						message: "Entry not found",
					},
					404,
			  );
	});
