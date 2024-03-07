import { Context } from "hono";
import { ObjectId } from "mongodb";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const jsonData = await App.parseBody<{ _id: string }>(c);
		if (!jsonData) return c.json({ status: 400, message: "Invalid body" }, 400);
		if (jsonData._id?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid account ID" }, 400);

		if (!c.req.query("confirm")) {
			const taskGetRatings = BWDatabase.tables.BWRatings.countDocuments({
				_userId: new ObjectId(jsonData._id),
			});
			const taskGetSessions = BWDatabase.tables.BWSession.countDocuments({
				_userId: new ObjectId(jsonData._id),
			});
			const taskGetPaymentMethods =
				BWDatabase.tables.BWPaymentMethods.countDocuments({
					_userId: new ObjectId(jsonData._id),
				});
			const taskGetPurchases = BWDatabase.tables.BWPurchases.countDocuments({
				_userId: new ObjectId(jsonData._id),
			});
			const taskResults = await Promise.all([
				taskGetRatings,
				taskGetSessions,
				taskGetPaymentMethods,
				taskGetPurchases,
			]);

			return c.json(
				{
					status: 400,
					message: `Confirmation required, add "?confirm=y" to the URL to proceed. To be affected: ${
						taskResults[0] + taskResults[1] + taskResults[2] + taskResults[3]
					}`,
					data: {
						affectedCount: {
							rating: taskResults[0],
							session: taskResults[1],
							paymentMethod: taskResults[2],
							purchase: taskResults[3],
						},
					},
				},
				400,
			);
		}

		const taskDeleteAccount = BWDatabase.tables.BWUsers.deleteOne({
			_id: new ObjectId(jsonData._id),
		});
		const taskDeleteRatings = BWDatabase.tables.BWRatings.deleteMany({
			_userId: new ObjectId(jsonData._id),
		});
		const taskDeleteSessions = BWDatabase.tables.BWSession.deleteMany({
			_userId: new ObjectId(jsonData._id),
		});
		const taskDeletePaymentMethods =
			BWDatabase.tables.BWPaymentMethods.deleteMany({
				_userId: new ObjectId(jsonData._id),
			});
		const taskDeletePurchases = BWDatabase.tables.BWPurchases.deleteMany({
			_userId: new ObjectId(jsonData._id),
		});
		const taskResults = await Promise.all([
			taskDeleteAccount,
			taskDeleteSessions,
			taskDeleteRatings,
			taskDeletePaymentMethods,
			taskDeletePurchases,
		]);

		return taskResults[0].deletedCount &&
			taskResults[1].acknowledged &&
			taskResults[2].acknowledged &&
			taskResults[3].acknowledged &&
			taskResults[4].acknowledged
			? c.json({
					status: 200,
					message: "Account deleted",
			  })
			: c.json(
					{
						status: 500,
						message: "Failed to delete account",
					},
					500,
			  );
	});
