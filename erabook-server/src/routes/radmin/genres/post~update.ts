import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWGenre } from "../../../models/index.js";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const jsonData = await App.parseBody<BWGenre>(c);
		if (!jsonData) return c.json({ status: 400, message: "Invalid body" }, 400);
		if (jsonData._id?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid genre ID" }, 400);

		const _id = new ObjectId(jsonData._id);
		delete jsonData._id;

		const taskUpdate = await BWDatabase.tables.BWGenres.updateOne(
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
						message: "Genre updated",
				  })
				: c.json(
						{
							status: 400,
							message: "Genre unchanged",
						},
						400,
				  );
		}

		return c.json(
			{
				status: 500,
				message: "Failed to update genre",
			},
			500,
		);
	});
