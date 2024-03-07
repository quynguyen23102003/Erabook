import { Context } from "hono";
import { ObjectId } from "mongodb";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const paramBookId = c.req.param("bookId");

		if (paramBookId.length !== 24)
			return c.json({ status: 400, message: "Invalid rating ID" }, 400);

		const existingRating = await BWDatabase.tables.BWRatings.findOne({
			_bookId: new ObjectId(paramBookId),
			_userId: user._id,
		});
		if (
			!existingRating ||
			existingRating._userId.toString() !== user._id.toString()
		) {
			return c.json(
				{
					status: 400,
					message: "No rating found",
				},
				400,
			);
		}

		const taskDelete = await BWDatabase.tables.BWRatings.deleteOne({
			_id: existingRating._id,
		});

		if (taskDelete.deletedCount) {
			// track
			await ActivityLogManager.appendAction(
				user,
				new ObjectId(existingRating._id),
				"ratings.remove",
			);

			return c.json({
				status: 200,
				message: "Rating removed",
			});
		}

		return c.json(
			{
				status: 500,
				message: "Failed to remove rating",
			},
			500,
		);
	});
