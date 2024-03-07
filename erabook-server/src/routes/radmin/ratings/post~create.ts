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
		if (jsonData._bookId?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid book ID" }, 400);
		if (jsonData._userId?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid user ID" }, 400);
		if (!jsonData.rating)
			return c.json({ status: 400, message: "Missing rating value" }, 400);
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
		if (jsonData.attachments && !Array.isArray(jsonData.attachments))
			return c.json(
				{ status: 400, message: "Attachments must be a list of strings" },
				400,
			);
		if (jsonData.comment.length > 400)
			return c.json(
				{ status: 400, message: "Comment must not exceed 400 characters" },
				400,
			);

		jsonData.postDate = Date.now();
		jsonData._userId = new ObjectId(jsonData._userId);
		jsonData._bookId = new ObjectId(jsonData._bookId);
		delete jsonData._id;

		const taskCreate = await BWDatabase.tables.BWRatings.insertOne(jsonData);

		return taskCreate.insertedId
			? c.json({
					status: 200,
					message: "Rating created",
					data: {
						_id: taskCreate.insertedId,
					},
			  })
			: c.json(
					{
						status: 500,
						message: "Failed to create rating",
					},
					500,
			  );
	});
