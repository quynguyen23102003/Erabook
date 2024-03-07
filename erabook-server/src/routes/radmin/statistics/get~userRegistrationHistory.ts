import { Context } from "hono";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const data = {
			total: await BWDatabase.tables.BWUsers.countDocuments(),
			lastDay: await BWDatabase.tables.BWUsers.countDocuments({
				createdAt: { $gte: Date.now() - 1 * 24 * 3600 * 1e3 },
			}),
			lastWeek: await BWDatabase.tables.BWUsers.countDocuments({
				createdAt: { $gte: Date.now() - 7 * 24 * 3600 * 1e3 },
			}),
			lastMonth: await BWDatabase.tables.BWUsers.countDocuments({
				createdAt: { $gte: Date.now() - 30 * 24 * 3600 * 1e3 },
			}),
			last6Months: await BWDatabase.tables.BWUsers.countDocuments({
				createdAt: { $gte: Date.now() - 180 * 24 * 3600 * 1e3 },
			}),
			lastYear: await BWDatabase.tables.BWUsers.countDocuments({
				createdAt: { $gte: Date.now() - 365 * 24 * 3600 * 1e3 },
			}),
		};

		return c.json({
			status: 200,
			message: "OK",
			data,
		});
	});
