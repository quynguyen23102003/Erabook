import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWBook } from "../../../models/index.js";
import { BWDatabase } from "../../../modules/database/index.js";
import {
	MongoBookConditions,
	MongoUserConditions,
} from "../../../modules/mongo/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const bookId = c.req.param("bookId");
		if (bookId.length !== 24)
			return c.json({ status: 400, message: "Invalid ID" }, 400);

		const entry = await BWDatabase.tables.BWBooks.aggregate<BWBook>([
			{
				$match: {
					_id: new ObjectId(bookId),
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
			...MongoUserConditions.userGetExistingRating(user), // explicitly used here
		]).next();

		return entry
			? c.json({
					status: 200,
					message: "Entry found",
					data: entry,
			  })
			: c.json(
					{
						status: 400,
						message: "Entry not found",
					},
					400,
			  );
	});
