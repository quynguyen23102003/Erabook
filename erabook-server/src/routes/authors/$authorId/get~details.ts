import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWAuthor } from "../../../models";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async () => {
		const authorId = c.req.param("authorId");
		if (authorId.length !== 24)
			return c.json({ status: 400, message: "Invalid ID" }, 400);

		const entry = await BWDatabase.tables.BWAuthors.aggregate<BWAuthor>([
			{
				$match: {
					_id: new ObjectId(authorId),
				},
			},
			{ $project: { _firebaseRef: 0 } },
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
