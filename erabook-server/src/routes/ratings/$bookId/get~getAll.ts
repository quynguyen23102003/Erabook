import { Context } from "hono";
import { Document, ObjectId } from "mongodb";
import { BWRating } from "../../../models";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { MongoPaginationConditions } from "../../../modules/mongo/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const paramBookId = c.req.param("bookId");

		if (paramBookId.length !== 24)
			return c.json({ status: 400, message: "Invalid book ID" }, 400);

		let queryPage =
			Number(c.req.query("p")) || Number(c.req.query("page")) || 1;
		if (queryPage < 0) queryPage = 1;
		let queryLimit = Number(c.req.query("limit")) || 50;
		if (queryLimit < 0) queryLimit = 50;

		const querySort = c.req.query("z") || c.req.query("sort");
		const querySortOrder = c.req.query("asc") ? 1 : -1;

		const condition: Document[] = [
			{
				$match: {
					_bookId: new ObjectId(paramBookId),
				},
			},
			{
				$addFields: {
					favorites: {
						$size: {
							$ifNull: ["$_favorites", []],
						},
					},
				},
			},
			{
				$lookup: {
					from: "BWUsers",
					let: { uid: "$_userId" },
					pipeline: [
						{
							$match: {
								$expr: {
									$eq: ["$_id", "$$uid"],
								},
							},
						},
						{
							$project: {
								_id: 1,
								username: 1,
								fullName: 1,
								avatarUrl: 1,
							},
						},
					],
					as: "author",
				},
			},
			{
				$set: {
					author: {
						$arrayElemAt: ["$author", 0],
					},
				},
			},
			{
				$addFields: {
					_user: {
						isFavorite: {
							$in: [user._id.toString(), { $ifNull: ["$_favorites", []] }],
						},
					},
				},
			},
			{
				$project: {
					_id: 1,
					rating: 1,
					postDate: 1,
					favorites: 1,
					author: 1,
					comment: 1,
					attachments: 1,
					_user: 1,
				},
			},
			{
				$sort: {
					postDate: -1,
				},
			},
			...MongoPaginationConditions.pagination(queryPage, queryLimit),
		];

		if (querySort) {
			switch (querySort) {
				case "postDate": {
					condition.push({
						$sort: {
							postDate: querySortOrder,
						},
					});
					break;
				}
				case "rating": {
					condition.push({
						$sort: {
							rating: querySortOrder,
						},
					});
					break;
				}
				default: {
					condition.push({
						$sort: {
							postDate: querySortOrder,
						},
					});
				}
			}
		}

		const ratingEntries =
			await BWDatabase.tables.BWRatings.aggregate<BWRating>(condition).next();

		// track
		await ActivityLogManager.appendAction(user, paramBookId, "ratings.getAll", {
			page: queryPage,
			sortBy: querySort,
			sortOrder: querySortOrder,
			limit: queryLimit,
		});

		return c.json({
			status: 200,
			message: "OK",
			...ratingEntries,
		});
	});
