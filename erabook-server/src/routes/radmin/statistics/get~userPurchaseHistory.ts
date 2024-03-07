import { Context } from "hono";
import { Document, ObjectId } from "mongodb";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const condition: Document = {};
		const queryStatus = c.req.query("status")?.toLowerCase();
		switch (queryStatus) {
			case "success": {
				condition.status = "success";
				break;
			}
			case "failed": {
				condition.status = "failed";
				break;
			}
			case "ongoing": {
				condition.status = "ongoing";
			}
		}

		const queryUserId = c.req.query("userId");
		if (queryUserId && queryUserId.length === 24) {
			condition._userId = new ObjectId(queryUserId);
		}

		const data = {
			total: await BWDatabase.tables.BWPurchases.countDocuments(condition),
			lastDay: await BWDatabase.tables.BWPurchases.countDocuments({
				timestamp: { $gte: Date.now() - 1 * 24 * 3600 * 1e3 },
				...condition,
			}),
			lastWeek: await BWDatabase.tables.BWPurchases.countDocuments({
				timestamp: { $gte: Date.now() - 7 * 24 * 3600 * 1e3 },
				...condition,
			}),
			lastMonth: await BWDatabase.tables.BWPurchases.countDocuments({
				timestamp: { $gte: Date.now() - 30 * 24 * 3600 * 1e3 },
				...condition,
			}),
			last6Months: await BWDatabase.tables.BWPurchases.countDocuments({
				timestamp: { $gte: Date.now() - 180 * 24 * 3600 * 1e3 },
				...condition,
			}),
			lastYear: await BWDatabase.tables.BWPurchases.countDocuments({
				timestamp: { $gte: Date.now() - 365 * 24 * 3600 * 1e3 },
				...condition,
			}),
		};

		return c.json({
			status: 200,
			message: "OK",
			data,
		});
	});
