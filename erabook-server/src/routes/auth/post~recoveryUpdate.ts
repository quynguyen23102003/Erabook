import { Context } from "hono";
import { App } from "../../modules/app.js";
import { BWDatabase } from "../../modules/database/index.js";
import { compilePassword } from "../../modules/password/index.js";

export default async (c: Context) => {
	const json = await App.parseBody<{
		emailAddress: string;
		code: string;
		password: string;
	}>(c);

	if (!json || !json.emailAddress || !json.code || !json.password) {
		return c.json(
			{
				status: 400,
				message: "Missing arguments",
			},
			400,
		);
	}

	const matchingCode = await BWDatabase.tables.BWRecovery.findOne({
		emailAddress: json.emailAddress,
		code: json.code,
		isUsed: false,
		validUntil: {
			$gte: Date.now(),
		},
	});

	if (!matchingCode) {
		App.error(`[Recovery] Failed to find rev code - ${json.emailAddress}`);

		return c.json(
			{
				status: 400,
				message: "Invalid request",
			},
			400,
		);
	}

	const taskUpdateRecoveryCode = await BWDatabase.tables.BWRecovery.updateOne(
		{
			_id: matchingCode._id,
		},
		{
			$set: {
				isUsed: true,
			},
		},
	);

	if (taskUpdateRecoveryCode.modifiedCount) {
		const taskUpdateUser = await BWDatabase.tables.BWUsers.updateOne(
			{
				emailAddress: json.emailAddress,
			},
			{
				$set: {
					password: compilePassword(json.password),
				},
			},
		);

		if (taskUpdateUser.modifiedCount) {
			App.info(`[${json.emailAddress}] Password modified`);
		} else {
			App.info(`[${json.emailAddress}] Password unchanged`);
		}

		return c.json({
			status: 200,
			message: "Password modified",
		});
	}

	App.error(
		`[Recovery] Failed to update rev code ${matchingCode.code} - ${matchingCode.emailAddress}`,
	);
	return c.json(
		{
			status: 500,
			message: "Failed to update password",
		},
		500,
	);
};
