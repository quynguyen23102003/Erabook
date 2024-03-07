import { Context } from "hono";
import { ObjectId } from "mongodb";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const jsonData = await App.parseBody<{ _id: string }>(c);
		if (!jsonData) return c.json({ status: 400, message: "Invalid body" }, 400);
		if (jsonData._id?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid rating ID" }, 400);

		if (!c.req.query("confirm")) {
			return c.json(
				{
					status: 400,
					message: `Confirmation required, add "?confirm=y" to the URL to proceed.`,
				},
				400,
			);
		}

		const taskDelete = await BWDatabase.tables.BWRatings.deleteOne({
			_id: new ObjectId(jsonData._id),
		});

		return taskDelete.deletedCount
			? c.json({
					status: 200,
					message: "Rating deleted",
			  })
			: c.json(
					{
						status: 500,
						message: "Failed to delete rating",
					},
					500,
			  );
	});
