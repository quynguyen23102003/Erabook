import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Context } from "hono";
import { InsertOneResult, UpdateResult } from "mongodb";
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
		if (!jsonData) return c.json({ status: 400, message: "Missing body" }, 400);
		if (!jsonData.username)
			return c.json({ status: 400, message: "Missing username" }, 400);
		if (!jsonData.password)
			return c.json({ status: 400, message: "Missing password" }, 400);
		if (!jsonData.emailAddress)
			return c.json({ status: 400, message: "Missing email address" }, 400);

		if (jsonData.password.length < 8)
			return c.json(
				{
					status: 400,
					message: "Password must contains at least 8 characters",
				},
				400,
			);
		jsonData.password = compilePassword(jsonData.password);
		delete jsonData._id;

		// check for existing username
		const account = await BWDatabase.tables.BWUsers.findOne({
			$or: [
				{
					username: jsonData.username,
				},
				{
					emailAddress: jsonData.emailAddress,
				},
			],
		});

		if (account) {
			return c.json(
				{
					status: 400,
					message: "Username or Email address is already taken",
				},
				400,
			);
		}

		let taskCreate: UpdateResult | InsertOneResult =
			await BWDatabase.tables.BWUsers.insertOne({
				...jsonData,
				shelf: [],
				wishlist: [],
			});
		const _id = taskCreate.insertedId;

		if ((jsonData.file as File)?.arrayBuffer()) {
			try {
				const fileBuffer = await (jsonData.file as File).arrayBuffer();
				const fileLocation = ref(firebaseStorage, `user_avatars/${_id}.jpg`);
				const fileSnapshot = await uploadBytes(fileLocation, fileBuffer);

				delete jsonData.file;
				jsonData.avatarUrl = await getDownloadURL(fileSnapshot.ref);
				jsonData._firebaseRef = `user_avatars/${_id}.jpg`;

				taskCreate = await BWDatabase.tables.BWUsers.updateOne(
					{ _id },
					{ $set: jsonData, $unset: { file: 1 } },
				);
			} catch (err) {
				console.error(err);

				await BWDatabase.tables.BWUsers.deleteOne({ _id });

				return c.json(
					{
						status: 500,
						message: "Failed to upload avatar",
					},
					500,
				);
			}
		}

		return taskCreate.acknowledged
			? c.json({
					status: 200,
					message: "Account created",
					data: {
						_id,
					},
			  })
			: c.json(
					{
						status: 500,
						message: "Failed to create account",
					},
					500,
			  );
	});
