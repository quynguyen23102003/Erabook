import { deleteObject, ref } from "firebase/storage";
import { Context } from "hono";
import { ObjectId } from "mongodb";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { firebaseStorage } from "../../../modules/firebase/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const jsonData = await App.parseBody<{ _id: string }>(c);
		if (!jsonData) return c.json({ status: 400, message: "Invalid body" }, 400);
		if (jsonData._id?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid author ID" }, 400);

		if (!c.req.query("confirm")) {
			const taskGetAffectedEntries =
				await BWDatabase.tables.BWBooks.countDocuments({
					_authorId: new ObjectId(jsonData._id),
				});

			return c.json(
				{
					status: 400,
					message: `Confirmation required, add "?confirm=y" to the URL to proceed. To be affected: ${taskGetAffectedEntries}`,
					data: { affectedCount: { books: taskGetAffectedEntries } },
				},
				400,
			);
		}

		const taskDeleteAuthor = BWDatabase.tables.BWAuthors.deleteOne({
			_id: new ObjectId(jsonData._id),
		});
		const taskUpdateBooks = BWDatabase.tables.BWBooks.updateMany(
			{
				_authorId: new ObjectId(jsonData._id),
			},
			{
				$unset: {
					_authorId: 1,
				},
				$set: {
					_removalTimestamp: Date.now(),
				},
			},
		);
		const taskRemovePortrait = deleteObject(
			ref(firebaseStorage, `author_portraits/${jsonData._id}.jpg`),
		);
		const taskResults = await Promise.all([
			taskDeleteAuthor,
			taskUpdateBooks,
			taskRemovePortrait,
		]);

		return taskResults[0].deletedCount && taskResults[1].acknowledged
			? c.json({
					status: 200,
					message: "Author deleted",
			  })
			: c.json(
					{
						status: 500,
						message: "Failed to delete author",
					},
					500,
			  );
	});
