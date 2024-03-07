import { Context } from "hono";
import { ActivityLogManager } from "../../modules/activityLog/index.js";
import { App } from "../../modules/app.js";
import { BWDatabase } from "../../modules/database/index.js";
import { compilePassword } from "../../modules/password/index.js";
import { SessionManager } from "../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const jsonData = await App.parseBody<{
			oldPassword: string;
			newPassword: string;
		}>(c);
		if (!jsonData) return c.json({ status: 400, message: "Missing body" }, 400);

		if (!jsonData.oldPassword) {
			return c.json({ status: 400, message: "Invalid old password" }, 400);
		}
		if (!jsonData.newPassword) {
			return c.json({ status: 400, message: "Invalid new password" }, 400);
		}
		if (compilePassword(jsonData.oldPassword) !== user.password) {
			return c.json({ status: 400, message: "Incorrect password" }, 400);
		}

		const taskUpdate = await BWDatabase.tables.BWUsers.updateOne(
			{
				_id: user._id,
			},
			{
				$set: {
					password: compilePassword(jsonData.newPassword),
				},
			},
		);

		// track
		await ActivityLogManager.appendAction(user, null, "account.updatePassword");

		if (taskUpdate.acknowledged) {
			return taskUpdate.modifiedCount
				? c.json({
						status: 200,
						message: "Password updated",
				  })
				: c.json({ status: 400, message: "Password unchanged" }, 400);
		}

		App.error(`${user.username} failed to acknowledge database update`);
		return c.json(
			{
				status: 500,
				message: "Failed to update password",
			},
			500,
		);
	});
