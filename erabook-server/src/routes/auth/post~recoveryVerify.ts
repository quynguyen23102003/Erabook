import { Context } from "hono";
import { App } from "../../modules/app.js";
import { BWDatabase } from "../../modules/database/index.js";

export default async (c: Context) => {
	const json = await App.parseBody<{ emailAddress: string; code: string }>(c);

	if (!json || !json.emailAddress || !json.code) {
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

	if (matchingCode) {
		return c.json({
			status: 200,
			message: "Successfully verified",
			data: {
				isVerified: true,
			},
		});
	}

	App.error(`[Recovery] Failed to find rev code - ${json.emailAddress}`);
	return c.json(
		{
			status: 400,
			message: "Invalid request",
		},
		400,
	);
	//
	// 	const taskUpdate = await BWDatabase.tables.BWRecovery.updateOne(
	// 		{
	// 			_id: matchingCode._id,
	// 		},
	// 		{
	// 			$set: {
	// 				isUsed: true,
	// 			},
	// 		}
	// 	);
	//
	// 	if (taskUpdate.modifiedCount) {
	// 		return c.json({
	// 			status: 200,
	// 			message: "Successfully verified",
	// 			data: {
	// 				isVerified: true,
	// 			},
	// 		});
	// 	} else {
	// 		App.error(`[Recovery] Failed to update rev code ${matchingCode.code} - ${matchingCode.emailAddress}`);
	//
	// 		return c.json(
	// 			{
	// 				status: 500,
	// 				message: "Internal server error",
	// 			},
	// 			500
	// 		);
	// 	}
};
