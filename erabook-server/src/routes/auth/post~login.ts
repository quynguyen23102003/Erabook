import { Context } from "hono";
import { ActivityLogManager } from "../../modules/activityLog/index.js";
import { App } from "../../modules/app.js";
import { BWDatabase } from "../../modules/database/index.js";
import { compilePassword } from "../../modules/password/index.js";
import { SessionManager } from "../../modules/session/index.js";

export default async (c: Context) => {
	const json = await App.parseBody<{ username: string; password: string }>(c);

	if (!json || !json.username || !json.password) {
		return c.json(
			{
				status: 400,
				message: "Missing arguments",
			},
			400,
		);
	}

	// invalid password length
	if (json.password.length < 8) {
		return c.json(
			{
				status: 400,
				message: "Password must contains at least 8 characters",
			},
			400,
		);
	}

	const account = await BWDatabase.tables.BWUsers.findOne({
		$or: [
			{
				username: json.username,
				password: compilePassword(json.password),
			},
			{
				emailAddress: json.username,
				password: compilePassword(json.password),
			},
		],
	});

	// Not found
	if (!account) {
		return c.json(
			{
				status: 400,
				message: "Invalid username or password",
			},
			400,
		);
	}

	const sessionData = await SessionManager.createTokens(account._id);
	if (sessionData) {
		// track
		await ActivityLogManager.appendAction(account, null, "auth.login");

		return c.json({
			status: 200,
			message: "Login successfully",
			data: sessionData,
		});
	}

	return c.json({ status: 500, message: "Failed to log in" }, 500);
};
