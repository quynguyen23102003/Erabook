import { Context } from "hono";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const taskGet = await BWDatabase.tables.BWPaymentMethods.find(
			{
				_userId: user._id,
			},
			{
				projection: {
					_userId: 0,
					cardSecret: 0,
				},
			},
		).toArray();

		// track
		await ActivityLogManager.appendAction(user, null, "account.billing.getAll");

		return c.json({
			status: 200,
			message: "OK",
			data: taskGet,
		});
	});
