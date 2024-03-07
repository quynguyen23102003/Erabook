import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWAuthor } from "../../../models/index.js";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { firebaseStorage } from "../../../modules/firebase/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const jsonData = await App.parseBody<BWAuthor>(c);
		if (!jsonData) return c.json({ status: 400, message: "Invalid body" }, 400);
		if (jsonData._id?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid author ID" }, 400);
		if (await (jsonData.file as File)?.arrayBuffer()) {
			try {
				const fileBody = jsonData.file as File;
				const fileLocation = ref(
					firebaseStorage,
					`author_portraits/${jsonData._id}.jpg`,
				);
				const fileSnapshot = await uploadBytes(
					fileLocation,
					await fileBody.arrayBuffer(),
				);

				jsonData.portrait = await getDownloadURL(fileSnapshot.ref);
				jsonData._firebaseRef = `author_portraits/${jsonData._id}.jpg`;

				delete jsonData.file;
			} catch (err) {
				console.error(err);
				return c.json(
					{
						status: 500,
						message: "Failed to upload author's portrait",
					},
					500,
				);
			}
		}

		const _id = new ObjectId(jsonData._id);
		delete jsonData._id;

		const taskUpdate = await BWDatabase.tables.BWAuthors.updateOne(
			{
				_id,
			},
			{
				$set: jsonData,
			},
		);

		if (taskUpdate.acknowledged) {
			return taskUpdate.modifiedCount
				? c.json({
						status: 200,
						message: "Author updated",
				  })
				: c.json(
						{
							status: 400,
							message: "Author unchanged",
						},
						400,
				  );
		}

		return c.json(
			{
				status: 500,
				message: "Failed to update author",
			},
			500,
		);
	});
