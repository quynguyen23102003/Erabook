import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Context } from "hono";
import { InsertOneResult, UpdateResult } from "mongodb";
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
		if (!jsonData.name)
			return c.json({ status: 400, message: "Missing name" }, 400);
		delete jsonData._id;

		let taskCreate: UpdateResult | InsertOneResult =
			await BWDatabase.tables.BWAuthors.insertOne(jsonData);
		const _id = taskCreate.insertedId;

		if (await (jsonData.file as File)?.arrayBuffer()) {
			try {
				const fileBuffer = await (jsonData.file as File).arrayBuffer();
				const fileLocation = ref(
					firebaseStorage,
					`author_portraits/${_id}.jpg`,
				);
				const fileSnapshot = await uploadBytes(fileLocation, fileBuffer);

				delete jsonData.file;
				jsonData.portrait = await getDownloadURL(fileSnapshot.ref);
				jsonData._firebaseRef = `author_portraits/${_id}.jpg`;

				taskCreate = await BWDatabase.tables.BWAuthors.updateOne(
					{ _id },
					{ $set: jsonData }, // FIXME updating path file would create conflict at file,
				);
			} catch (err) {
				console.error(err);

				await BWDatabase.tables.BWAuthors.deleteOne({ _id });

				return c.json(
					{
						status: 500,
						message: "Failed to upload author's portrait",
					},
					500,
				);
			}
		}

		return taskCreate.acknowledged
			? c.json({
					status: 200,
					message: "Author created",
					data: {
						_id,
					},
			  })
			: c.json(
					{
						status: 500,
						message: "Failed to create author",
					},
					500,
			  );
	});
