import { Context } from "hono";
import { ActivityLogManager } from "../../modules/activityLog/index.js";
import { SessionManager } from "../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		delete user._role;
		delete user._firebaseRef;
		delete user.password;

		// track
		await ActivityLogManager.appendAction(user, null, "account.details");

		return c.json({
			status: 200,
			message: "OK",
			data: user,
		});
	});
