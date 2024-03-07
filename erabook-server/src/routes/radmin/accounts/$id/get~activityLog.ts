import { Context } from "hono";
import { Document } from "mongodb";
import { BWDatabase } from "../../../../modules/database/index.js";
import { MongoPaginationConditions } from "../../../../modules/mongo/index.js";
import { SessionManager } from "../../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const userId = c.req.param("id");
		if (userId.length !== 24)
			return c.json({ status: 400, message: "Invalid account ID" }, 400);

		let queryPage =
			Number(c.req.query("p")) || Number(c.req.query("page")) || 1;
		if (queryPage < 0) queryPage = 1;
		let queryLimit = Number(c.req.query("limit")) || 50;
		if (queryLimit < 0) queryLimit = 50;
		const condition: Document[] = [
			{
				$match: {
					_userId: user._id,
				},
			},
			...MongoPaginationConditions.pagination(queryPage, queryLimit),
		];

		const activityEntries =
			await BWDatabase.tables.BWActivityLog.aggregate(condition).next();

		return c.json({
			status: 200,
			message: "OK",
			...activityEntries,
		});
	});
