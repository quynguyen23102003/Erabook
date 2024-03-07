import { Context } from "hono";
import { ActivityLogManager } from "../../modules/activityLog/index.js";
import { App } from "../../modules/app.js";
import { BWDatabase } from "../../modules/database/index.js";
import { compilePassword } from "../../modules/password/index.js";
import { SessionManager } from "../../modules/session/index.js";

export default async (c: Context) => {
	const json = await App.parseBody<{
		username: string;
		password: string;
		emailAddress: string;
		ageGroup?: { from?: number; to?: number };
	}>(c);

	// invalid request / missing variables
	if (!json || !json.username || !json.password || !json.emailAddress) {
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

	if (json.ageGroup && !json.ageGroup.from) {
		return c.json(
			{
				status: 400,
				message: "Age group must have a valid starting age",
			},
			400,
		);
	}

	// check for existing username
	const account = await BWDatabase.tables.BWUsers.findOne({
		$or: [
			{
				username: json.username,
			},
			{
				emailAddress: json.emailAddress,
			},
		],
	});

	if (account) {
		return c.json(
			{
				status: 400,
				message: "Username or Email address is already taken",
			},
			400,
		);
	}

	// create account
	const user = await BWDatabase.tables.BWUsers.insertOne({
		_role: "user",
		username: json.username,
		password: compilePassword(json.password),
		emailAddress: json.emailAddress,
		createdAt: Date.now(),
		ageGroup: json.ageGroup,
		preferredGenres: [],
		wishlist: [],
		shelf: [],
	});

	if (!user.acknowledged) {
		App.error(`DB Failed to create user ${json.username}`);

		return c.json(
			{
				status: 500,
				message: "Failed to register account",
			},
			500,
		);
	}

	const sessionData = await SessionManager.createTokens(user.insertedId);
	if (sessionData) {
		// track
		await ActivityLogManager.appendAction(
			user.insertedId,
			null,
			"auth.register",
		);

		return c.json({
			status: 200,
			message: "Registration successful",
			data: sessionData,
		});
	}

	return c.json(
		{
			status: 500,
			message: "Failed to register account",
		},
		500,
	);
};
