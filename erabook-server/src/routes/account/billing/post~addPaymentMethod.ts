import { Context } from "hono";
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
		if (!jsonData._type)
			return c.json({ status: 400, message: "Missing payment type" }, 400);
		if (!jsonData.bankName)
			return c.json({ status: 400, message: "Missing bank name" }, 400);

		if (!jsonData.cardNumber)
			return c.json({ status: 400, message: "Missing card number" }, 400);
		if (!jsonData.cardHolderName)
			return c.json({ status: 400, message: "Missing card holder name" }, 400);
		if (!jsonData.cardSecret)
			return c.json({ status: 400, message: "Missing card secret" }, 400);
		if (!jsonData.cardExpiration)
			return c.json(
				{ status: 400, message: "Missing card expiration date" },
				400,
			);

		if (!__PaymentMethods.includes(jsonData._type)) {
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

		jsonData._userId = user._id;

		const existingPaymentMethod =
			await BWDatabase.tables.BWPaymentMethods.findOne({
				cardNumber: jsonData.cardNumber,
			});

		if (existingPaymentMethod) {
			return c.json(
				{
					status: 400,
					message: "Unable to add payment method, please try a different one",
					data:
						existingPaymentMethod._userId.toString() === user._id.toString()
							? { _id: existingPaymentMethod._id.toString() }
							: undefined,
				},
				400,
			);
		}

		const sanitizedData: BWPaymentMethod = {
			_type: jsonData._type,
			_userId: user._id,
			timestamp: Date.now(),
			cardHolderName: jsonData.cardHolderName,
			cardNumber: jsonData.cardNumber,
			cardSecret: jsonData.cardSecret,
			cardExpiration: jsonData.cardExpiration,
			bankName: jsonData.bankName,
		};

		const taskCreate =
			await BWDatabase.tables.BWPaymentMethods.insertOne(sanitizedData);

		if (taskCreate.insertedId) {
			// track
			await ActivityLogManager.appendAction(
				user,
				taskCreate.insertedId,
				"account.billing.addPaymentMethod",
				{
					_id: taskCreate.insertedId,
				},
			);

			return c.json({
				status: 200,
				message: "Payment method added",
				data: {
					_id: taskCreate.insertedId,
				},
			});
		}

		return c.json(
			{
				status: 500,
				message: "Failed to add payment method",
			},
			500,
		);
	});
