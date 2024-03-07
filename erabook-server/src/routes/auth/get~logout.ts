import { Context } from "hono";
import { ActivityLogManager } from "../../modules/activityLog/index.js";
import { App } from "../../modules/app.js";
import { SessionManager } from "../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const removedCount = await SessionManager.deleteExistingRefreshTokens(
			user._id,
		);

		App.info(`${user.username} logged out - Deleted ${removedCount}`);

		// track
		await ActivityLogManager.appendAction(user, null, "auth.logout");

		return c.json({
			status: 200,
			message: "Successfully logged out",
		});
	});
