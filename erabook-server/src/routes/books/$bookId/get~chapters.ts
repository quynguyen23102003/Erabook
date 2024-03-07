import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWBook } from "../../../models/index.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async () => {
		const bookId = c.req.param("bookId");
		if (bookId.length !== 24)
			return c.json({ status: 400, message: "Invalid ID" }, 400);

		const entry = await BWDatabase.tables.BWBooks.aggregate<BWBook>([
			{
				$match: {
					_id: new ObjectId(bookId),
				},
			},
			{
				$project: {
					_id: 0,
					title: 1,
					chapters: 1,
				},
			},
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
