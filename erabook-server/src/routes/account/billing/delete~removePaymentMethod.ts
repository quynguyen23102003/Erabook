import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWPaymentMethod } from "../../../models/index.js";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const jsonData = await App.parseBody<BWPaymentMethod>(c);

		if (!jsonData) return c.json({ status: 400, message: "Missing body" }, 400);
		if (jsonData._id?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid payment method ID" }, 400);

		const existingPaymentMethod =
			await BWDatabase.tables.BWPaymentMethods.findOne({
				_id: new ObjectId(jsonData._id),
				_userId: user._id,
			});

		if (!existingPaymentMethod) {
			return c.json(
				{
					status: 400,
					message: "Invalid payment method",
				},
				400,
			);
		}

		const taskRemovePMEntry = BWDatabase.tables.BWPaymentMethods.deleteOne({
			_id: existingPaymentMethod._id,
		});
		const taskUpdatePurchases = BWDatabase.tables.BWPurchases.updateMany(
			{
				_userId: user._id,
				_paymentMethodId: existingPaymentMethod._id,
			},
			{
				$unset: {
					_paymentMethodId: 1,
				},
			},
		);
		const taskResults = await Promise.all([
			taskRemovePMEntry,
			taskUpdatePurchases,
		]);

		if (taskResults[0].deletedCount) {
			// track
			await ActivityLogManager.appendAction(
				user,
				existingPaymentMethod._id,
				"account.billing.removePM",
				{
					affectedCount: { purchases: taskResults[1].modifiedCount },
				},
			);

			return c.json({
				status: 200,
				message: "Payment method removed",
			});
		}

		return c.json(
			{
				status: 500,
				message: "Failed to remove payment method",
			},
			500,
		);
	});
