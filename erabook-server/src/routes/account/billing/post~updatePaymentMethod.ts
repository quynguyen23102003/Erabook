import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWPaymentMethod } from "../../../models/index.js";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

const __PaymentMethods = ["gpay", "momo", "visa", "mastercard", "zalopay"];

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const jsonData = await App.parseBody<BWPaymentMethod>(c);

		if (!jsonData) return c.json({ status: 400, message: "Missing body" }, 400);
		if (jsonData._id?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid payment method ID" }, 400);
		if (jsonData._type && !__PaymentMethods.includes(jsonData._type)) {
			return c.json(
				{
					status: 400,
					message: `Invalid payment type. Possible are: ${__PaymentMethods.join(
						", ",
					)}`,
				},
				400,
			);
		}

		const _id = new ObjectId(jsonData._id);
		const existingPaymentMethod =
			await BWDatabase.tables.BWPaymentMethods.findOne({
				_id,
				_userId: user._id,
			});

		if (!existingPaymentMethod) {
			return c.json({ status: 400, message: "Payment method not found" }, 400);
		}

		const sanitizedData: BWPaymentMethod = {
			_userId: user._id,
			timestamp: Date.now(),
			_type: jsonData._type || existingPaymentMethod._type,
			cardHolderName:
				jsonData.cardHolderName || existingPaymentMethod.cardHolderName,
			cardNumber: jsonData.cardNumber || existingPaymentMethod.cardNumber,
			cardSecret: jsonData.cardSecret || existingPaymentMethod.cardSecret,
			cardExpiration:
				jsonData.cardExpiration || existingPaymentMethod.cardExpiration,
			bankName: jsonData.bankName || existingPaymentMethod.bankName,
		};

		const taskUpdate = await BWDatabase.tables.BWPaymentMethods.updateOne(
			{
				_id,
			},
			{
				$set: sanitizedData,
			},
		);

		if (taskUpdate.modifiedCount) {
			// track
			await ActivityLogManager.appendAction(
				user,
				_id,
				"account.billing.updatePaymentMethod",
				{ _id },
			);

			return c.json({
				status: 200,
				message: "Payment method updated",
			});
		}

		return c.json(
			{
				status: 500,
				message: "Failed to update payment method",
			},
			500,
		);
	});
