import { Context } from "hono";
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
		if (!jsonData.name)
			return c.json({ status: 400, message: "Missing name" }, 400);
		if (!jsonData.description)
			return c.json({ status: 400, message: "Missing description" }, 400);

		delete jsonData._id;

		const taskCreate = await BWDatabase.tables.BWGenres.insertOne(jsonData);

		return taskCreate.insertedId
			? c.json({
					status: 200,
					message: "Genre created",
					data: {
						_id: taskCreate.insertedId,
					},
			  })
			: c.json(
					{
						status: 500,
						message: "Failed to create genre",
					},
					500,
			  );
	});
