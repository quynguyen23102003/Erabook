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

		try {
			const taskRemove = await BWDatabase.tables.BWUsers.updateOne(
				{
					_id: user._id,
				},
				{
					$pull: {
						wishlist: {
							bookId: new ObjectId(bookId),
						},
					},
				},
			);

			if (taskRemove.acknowledged) {
				if (taskRemove.modifiedCount) {
					// track
					await ActivityLogManager.appendAction(
						user,
						new ObjectId(bookId),
						"books.wishlist.remove",
					);

					return c.json({
						status: 200,
						message: "Removed from wishlist",
					});
				}

				return c.json(
					{
						status: 400,
						message: "Not on wishlist",
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
		} catch {
			return c.json(
				{
					status: 400,
					message: "Not on wishlist",
				},
				400,
			);
		}
	});
