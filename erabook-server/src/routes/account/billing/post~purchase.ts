import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWPurchase } from "../../../models/index.js";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { OwnershipManager } from "../../../modules/ownership/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const jsonData = await App.parseBody<BWPurchase>(c);

		if (!jsonData) return c.json({ status: 400, message: "Missing body" }, 400);
		if (!jsonData._bookIds)
			return c.json({ status: 400, message: "Missing book ID array" }, 400);
		if (!jsonData._paymentMethodId)
			return c.json({ status: 400, message: "Missing payment method" }, 400);

		if (!Array.isArray(jsonData._bookIds)) {
			return c.json(
				{
					status: 400,
					message: "Item list is not an array",
				},
				400,
			);
		}
		if (jsonData._bookIds.some((id) => id.toString().length !== 24))
			return c.json(
				{
					status: 400,
					message: "Item list contains invalid ID",
				},
				400,
			);

		for (const id of jsonData._bookIds) {
			if (await OwnershipManager.hasBookOwnership(user._id, new ObjectId(id))) {
				return c.json(
					{
						status: 400,
						message: "Already owned an item",
						data: {
							_id: id,
						},
					},
					400,
				);
			}
		}

		const matchingPaymentMethod =
			await BWDatabase.tables.BWPaymentMethods.findOne({
				_id: new ObjectId(jsonData._paymentMethodId),
				_userId: user._id,
			});
		if (!matchingPaymentMethod) {
			return c.json(
				{
					status: 400,
					message: "Invalid payment method",
				},
				400,
			);
		}

		let totalPrice = 0;
		for (const book of await BWDatabase.tables.BWBooks.find({
			_id: { $in: jsonData._bookIds.map((id) => new ObjectId(id)) },
		}).toArray())
			totalPrice += book.price || 0;

		const sanitizedData: BWPurchase = {
			_userId: user._id,
			_bookIds: jsonData._bookIds,
			_paymentMethodId: matchingPaymentMethod._id,
			status: "success",
			timestamp: Date.now(),
			totalAmount: totalPrice,
		};

		const taskCreate =
			await BWDatabase.tables.BWPurchases.insertOne(sanitizedData);

		if (taskCreate.insertedId) {
			// track
			await ActivityLogManager.appendAction(
				user,
				taskCreate.insertedId,
				"account.billing.purchase",
			);

			return c.json({
				status: 200,
				message: "Successfully purchased item(s)",
				data: {
					purchaseId: taskCreate.insertedId,
				},
			});
		}

		return c.json(
			{
				status: 500,
				message: "Failed to purchase item(s)",
			},
			500,
		);
	});
