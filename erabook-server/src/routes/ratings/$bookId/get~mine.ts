import { Context } from "hono";
import { Document, ObjectId } from "mongodb";
import { BWRating } from "../../../models";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const paramBookId = c.req.param("bookId");

		if (paramBookId.length !== 24)
			return c.json({ status: 400, message: "Invalid book ID" }, 400);

		const condition: Document[] = [
			{
				$match: {
					_bookId: new ObjectId(paramBookId),
					_userId: user._id,
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
		];

		const ratingEntrySelf =
			await BWDatabase.tables.BWRatings.aggregate<BWRating>(condition).next();

		// track
		await ActivityLogManager.appendAction(user, paramBookId, "ratings.self");

		return ratingEntrySelf
			? c.json({
					status: 200,
					message: "OK",
					data: ratingEntrySelf,
			  })
			: c.json(
					{
						status: 400,
						message: "User hasn't posted any rating for this book yet",
					},
					400,
			  );
	});
