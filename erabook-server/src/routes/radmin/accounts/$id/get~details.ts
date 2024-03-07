import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWDatabase } from "../../../../modules/database/index.js";
import { SessionManager } from "../../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const paramId = c.req.param("id");
		if (paramId.length !== 24)
			return c.json({ status: 400, message: "Invalid account ID" }, 400);

		const existingEntry = await BWDatabase.tables.BWUsers.findOne(
			{
				_id: new ObjectId(paramId),
			},
			{
				projection: {
					password: 0,
				},
			},
		);

		return existingEntry
			? c.json({
					status: 200,
					message: "OK",
					data: existingEntry,
			  })
			: c.json(
					{
						status: 400,
						message: "Not found",
					},
					400,
			  );
	});
