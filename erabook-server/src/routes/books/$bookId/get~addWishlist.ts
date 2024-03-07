import { Context } from "hono";
import { ObjectId } from "mongodb";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const bookId = c.req.param("bookId");
		if (bookId.length !== 24)
			return c.json({ status: 400, message: "Invalid ID" }, 400);

		const existingWishlistEntry = user.wishlist?.find(
			(w) => w.bookId.toString() === bookId,
		);
		if (existingWishlistEntry) {
			return c.json(
				{
					status: 400,
					message: "Already added to wishlist",
				},
				400,
			);
		}

		const taskUpdate = await BWDatabase.tables.BWUsers.updateOne(
			{
				_id: user._id,
			},
			[
				{
					$set: {
						wishlist: {
							$ifNull: [
								{
									$concatArrays: [
										"$wishlist",
										[
											{
												bookId: new ObjectId(bookId),
												timestamp: Date.now(),
											},
										],
									],
								},
								[
									{
										bookId: new ObjectId(bookId),
										timestamp: Date.now(),
									},
								],
							],
						},
					},
				},
			],
		);

		if (taskUpdate.acknowledged) {
			if (taskUpdate.modifiedCount) {
				// track
				await ActivityLogManager.appendAction(
					user,
					new ObjectId(bookId),
					"books.wishlist.add",
				);

				return c.json({
					status: 200,
					message: "Added to wishlist",
				});
			}

			return c.json(
				{
					status: 400,
					message: "Already added to wishlist",
				},
				400,
			);
		}

		return c.json(
			{
				status: 500,
				message: "Internal server error",
			},
			500,
		);
	});
