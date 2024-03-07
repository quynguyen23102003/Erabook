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
			return c.json({ status: 400, message: "Invalid genre ID" }, 400);

		if (!c.req.query("confirm")) {
			const taskGetAffectedBookEntries =
				BWDatabase.tables.BWBooks.countDocuments({
					$or: [
						{ _genreIds: jsonData._id },
						{ _genreIds: new ObjectId(jsonData._id) },
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
				taskGetAffectedBookEntries,
				taskGetAffectedUserEntries,
			]);

			return c.json(
				{
					status: 400,
					message: `Confirmation required, add "?confirm=y" to the URL to proceed. To be affected: ${
						taskResults[0] + taskResults[1]
					}`,
					data: {
						affectedCount: { books: taskResults[0], users: taskResults[1] },
					},
				},
				400,
			);
		}

		const taskDeleteGenre = BWDatabase.tables.BWGenres.deleteOne({
			_id: new ObjectId(jsonData._id),
		});
		const taskUpdateBooks = BWDatabase.tables.BWBooks.updateMany(
			{
				_genreIds: jsonData._id,
			},
			{
				$pull: { _genreIds: jsonData._id },
				$set: {
					_removalTimestamp: Date.now(),
				},
			},
		);
		try {
			await BWDatabase.tables.BWUsers.updateMany(
				{},
				{
					$pull: {
						// TODO temp fix, this does not have any fix available, will have to put it in a try-catch
						preferredGenres: jsonData._id,
					},
				},
			);
		} catch {}
		const taskResults = await Promise.all([taskDeleteGenre, taskUpdateBooks]);

		return taskResults[0].deletedCount && taskResults[1].acknowledged
			? c.json({
					status: 200,
					message: "Genre deleted",
			  })
			: c.json(
					{
						status: 500,
						message: "Failed to delete genre",
					},
					500,
			  );
	});
