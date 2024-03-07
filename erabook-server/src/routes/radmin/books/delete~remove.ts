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
			return c.json({ status: 400, message: "Invalid book ID" }, 400);

		if (!c.req.query("confirm")) {
			const taskGetAffectedPurchaseEntries =
				BWDatabase.tables.BWPurchases.countDocuments({
					$or: [
						{ _bookIds: jsonData._id },
						{ _bookIds: new ObjectId(jsonData._id) },
					],
				});
			const taskGetAffectedUserEntries =
				BWDatabase.tables.BWUsers.countDocuments({
					$or: [
						{ preferredGenres: jsonData._id },
						{ preferredGenres: new ObjectId(jsonData._id) },
					],
				});
			const taskResults = await Promise.all([
				taskGetAffectedPurchaseEntries,
				taskGetAffectedUserEntries,
			]);

			return c.json(
				{
					status: 400,
					message: `Confirmation required, add "?confirm=y" to the URL to proceed. To be affected: ${
						taskResults[0] + taskResults[1]
					}`,
					data: {
						affectedCount: { purchases: taskResults[0], users: taskResults[1] },
					},
				},
				400,
			);
		}

		const taskDeleteBook = BWDatabase.tables.BWBooks.updateOne(
			{
				_id: new ObjectId(jsonData._id),
			},
			{
				$set: {
					_removalTimestamp: Date.now(),
				},
			},
		);
		const taskResults = await Promise.all([taskDeleteBook]);

		return taskResults[0].modifiedCount
			? c.json({
					status: 200,
					message: "Book deleted",
			  })
			: c.json(
					{
						status: 500,
						message: "Failed to delete book",
					},
					500,
			  );
	});
