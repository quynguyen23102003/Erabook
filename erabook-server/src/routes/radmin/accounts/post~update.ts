import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWUser } from "../../../models/index.js";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { firebaseStorage } from "../../../modules/firebase/index.js";
import { compilePassword } from "../../../modules/password/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const jsonData = await App.parseBody<BWUser>(c);
		if (!jsonData) return c.json({ status: 400, message: "Invalid body" }, 400);
		if (jsonData._id?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid account ID" }, 400);
		if (jsonData.password)
			jsonData.password = compilePassword(jsonData.password);

		const _id = new ObjectId(jsonData._id);
		delete jsonData._id;

		if ((jsonData.file as File)?.arrayBuffer()) {
			try {
				const fileBuffer = await (jsonData.file as File).arrayBuffer();
				const fileLocation = ref(firebaseStorage, `user_avatars/${_id}.jpg`);
				const fileSnapshot = await uploadBytes(fileLocation, fileBuffer);

				delete jsonData.file;
				jsonData.avatarUrl = await getDownloadURL(fileSnapshot.ref);
				jsonData._firebaseRef = `user_avatars/${_id}.jpg`;
			} catch (err) {
				console.error(err);

				return c.json(
					{
						status: 500,
						message: "Failed to upload avatar",
					},
					500,
				);
			}
		}

		const taskUpdate = await BWDatabase.tables.BWUsers.updateOne(
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
						message: "Account updated",
				  })
				: c.json(
						{
							status: 400,
							message: "Account unchanged",
						},
						400,
				  );
		}

		return c.json(
			{
				status: 500,
				message: "Failed to update account",
			},
			500,
		);
	});
