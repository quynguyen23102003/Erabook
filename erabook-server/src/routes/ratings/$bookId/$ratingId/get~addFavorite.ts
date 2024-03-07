import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWDatabase } from "../../../../modules/database/index.js";
import { SessionManager } from "../../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const paramBookId = c.req.param("bookId");
		const paramRatingId = c.req.param("ratingId");

		if (paramBookId.length !== 24)
			return c.json({ status: 400, message: "Invalid book ID" }, 400);
		if (paramRatingId.length !== 24)
			return c.json({ status: 400, message: "Invalid rating ID" }, 400);

		const taskGet = await BWDatabase.tables.BWRatings.findOne({
			_id: new ObjectId(paramRatingId),
			_bookId: new ObjectId(paramBookId),
			_favorites: user._id.toString(),
		});
		if (taskGet) {
			return c.json(
				{
					status: 400,
					message: "Already added this rating to user's favorite list",
				},
				400,
			);
		}

		const taskUpdate = await BWDatabase.tables.BWRatings.updateOne(
			{
				_id: new ObjectId(paramRatingId),
				_bookId: new ObjectId(paramBookId),
			},
			{
				$push: {
					_favorites: user._id.toString(),
				},
			},
		);

		if (taskUpdate.acknowledged) {
			return taskUpdate.modifiedCount
				? c.json({
						status: 200,
						message: "Successfully favorite rating",
				  })
				: c.json(
						{
							status: 400,
							message: "Already added this rating to user's favorite list",
						},
						400,
				  );
		}

		return c.json(
			{
				status: 500,
				message: "Failed to add this rating to user's favorite list",
			},
			500,
		);
	});
