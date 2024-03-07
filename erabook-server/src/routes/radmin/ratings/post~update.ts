import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWRating } from "../../../models/index.js";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const jsonData = await App.parseBody<BWRating>(c);
		if (!jsonData) return c.json({ status: 400, message: "Invalid body" }, 400);
		if (jsonData._id?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid rating ID" }, 400);
		if (
			!Number(jsonData.rating) ||
			!(jsonData.rating >= 1 && jsonData.rating <= 5)
		)
			return c.json(
				{
					status: 400,
					message: "Invalid rating value, must be between 1 to 5",
				},
				400,
			);
		if (jsonData.comment.length > 400)
			return c.json(
				{ status: 400, message: "Comment must not exceed 400 characters" },
				400,
			);
		if (delete jsonData.postDate) jsonData.postDate;

		const _id = new ObjectId(jsonData._id);
		delete jsonData._id;
		jsonData._userId = new ObjectId(jsonData._userId);
		jsonData._bookId = new ObjectId(jsonData._bookId);

		const existingRating = await BWDatabase.tables.BWRatings.findOne(
			{
				_id,
			},
			{
				projection: {
					_id: 0,
				},
			},
		);

		const taskUpdate = await BWDatabase.tables.BWRatings.updateOne(
			{
				_id,
			},
			{
				$set: jsonData,
			},
		);

		if (taskUpdate.acknowledged) {
			return taskUpdate.modifiedCount
				? c.json({
						status: 200,
						message: "Rating updated",
						data: {
							old: existingRating,
							new: jsonData,
						},
				  })
				: c.json(
						{
							status: 400,
							message: "Rating unchanged",
						},
						400,
				  );
		}

		return c.json(
			{
				status: 500,
				message: "Failed to update rating",
			},
			500,
		);
	});
