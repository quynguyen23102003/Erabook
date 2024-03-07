import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWRating } from "../../../models/index.js";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const paramBookId = c.req.param("bookId");

		if (paramBookId.length !== 24)
			return c.json({ status: 400, message: "Invalid book ID" }, 400);

		const jsonData = await App.parseBody<BWRating>(c);
		if (!jsonData) return c.json({ status: 400, message: "Missing body" }, 400);
		if (!jsonData.rating)
			return c.json({ status: 400, message: "Missing rating value" }, 400);

		jsonData.rating = Math.round(Number(jsonData.rating));
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

		// if (jsonData.attachments && !Array.isArray(jsonData.attachments))
		// 	return c.json({ status: 400, message: "Attachments must be a list of strings" }, 400);

		if (jsonData.comment) {
			if (jsonData.comment.length > 400)
				return c.json(
					{ status: 400, message: "Comment must not exceed 400 characters" },
					400,
				);

			// if (profanityCheck(jsonData.comment))
			// 	return c.json(
			// 		{ status: 400, message: "Comment contains prohibited words" },
			// 		400,
			// 	);
		}

		jsonData.rating = Math.floor(jsonData.rating);
		jsonData.postDate = Date.now();
		jsonData._userId = user._id;
		jsonData._bookId = new ObjectId(paramBookId);

		const existingRating = await BWDatabase.tables.BWRatings.findOne({
			_userId: user._id,
			_bookId: jsonData._bookId,
		});
		if (existingRating) {
			return c.json(
				{
					status: 400,
					message:
						"Already have a rating, please update or remove the existing one",
				},
				400,
			);
		}

		const sanitizedData: BWRating = {
			_favorites: [],
			_userId: jsonData._userId,
			_bookId: jsonData._bookId,
			rating: jsonData.rating,
			postDate: jsonData.postDate,
			comment: jsonData.comment,
		};
		for (const key of Object.keys(sanitizedData)) {
			// @ts-ignore
			if (sanitizedData[key] === undefined) delete sanitizedData[key];
		}

		const taskCreate =
			await BWDatabase.tables.BWRatings.insertOne(sanitizedData);

		if (taskCreate.insertedId) {
			// track
			await ActivityLogManager.appendAction(
				user,
				taskCreate.insertedId,
				"ratings.create",
			);

			return c.json({
				status: 200,
				message: "Rating created",
				data: {
					_id: taskCreate.insertedId,
				},
			});
		}

		return c.json(
			{
				status: 500,
				message: "Failed to create rating",
			},
			500,
		);
	});
