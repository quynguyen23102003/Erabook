import { Context } from "hono";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import { BWDatabase } from "../../../modules/database/index.js";
import {
	MongoBookConditions,
	MongoPaginationConditions,
	MongoUserConditions,
} from "../../../modules/mongo/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		let queryPage =
			Number(c.req.query("p")) || Number(c.req.query("page")) || 1;
		if (queryPage < 0) queryPage = 1;
		let queryLimit = Number(c.req.query("limit")) || 50;
		if (queryLimit < 0) queryLimit = 50;

		const taskGet = await BWDatabase.tables.BWPurchases.aggregate([
			{
				$match: {
					_userId: user._id,
				},
			},
			{
				$lookup: {
					from: "BWPaymentMenthods",
					let: { uid: user._id, pid: "$_paymentMethodId" },
					as: "paymentMethod",
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$_userId", "$$uid"] },
										{ $eq: ["$_id", "$$pid"] },
									],
								},
							},
						},
						{
							$project: {
								_id: 1,
								_type: 1,
								bankName: 1,
								cardNumber: 1,
							},
						},
					],
				},
			},
			{
				$set: {
					paymentMethod: {
						$arrayElemAt: ["$paymentMethod", 0],
					},
				},
			},
			{
				$lookup: {
					from: "BWBooks",
					let: { bids: "$_bookIds" },
					as: "books",
					pipeline: [
						{
							$match: {
								$expr: {
									$or: [
										{ $in: ["$_id", "$$bids"] },
										{ $in: [{ $toString: "$_id" }, "$$bids"] },
									],
								},
							},
						},
						...MongoBookConditions.bookBaseCondition,
						...MongoBookConditions.bookGetChapterCount,
						...MongoBookConditions.bookGetAuthor,
						...MongoBookConditions.bookGetGenres,
						...MongoBookConditions.bookGetPageCount,
						...MongoBookConditions.bookGetPurchaseCount,
						...MongoBookConditions.bookGetRatingInfo,
						...MongoUserConditions.userGetPurchaseState(user),
						...MongoUserConditions.userGetReadingState(user),
						...MongoUserConditions.userGetWishlistState(user),
					],
				},
			},
			{
				$project: {
					_userId: 0,
					_bookIds: 0,
					_paymentMethodId: 0,
				},
			},
			...MongoPaginationConditions.pagination(queryPage, queryLimit),
		]).next();

		// track
		await ActivityLogManager.appendAction(
			user,
			null,
			"account.billing.history",
		);

		return c.json({
			status: 200,
			message: "OK",
			...taskGet,
		});
	});
