import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Context } from "hono";
import { BWUser } from "../../models/index.js";
import { ActivityLogManager } from "../../modules/activityLog/index.js";
import { App } from "../../modules/app.js";
import { BWDatabase } from "../../modules/database/index.js";
import { firebaseStorage } from "../../modules/firebase/index.js";
import { SessionManager } from "../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const jsonData = await App.parseBody<
			BWUser & { oldPassword: string; newPassword: string }
		>(c);
		if (!jsonData) return c.json({ status: 400, message: "Missing body" }, 400);

		// would require verification again if email changed
		if (jsonData.emailAddress && jsonData.emailAddress !== user.emailAddress) {
			// execute verification process here
		}

		// remove this field
		delete jsonData.password;
		// 		if (jsonData.oldPassword && jsonData.newPassword) {
		// 			if (compilePassword(jsonData.oldPassword) !== user.password) {
		// 				return c.json({ status: 400, message: "Incorrect password" }, 400);
		// 			}
		//
		// 			jsonData.password = compilePassword(jsonData.newPassword);
		// 		}

		if (jsonData.ageGroup) {
			if (
				typeof jsonData.ageGroup === "string" ||
				!Object.hasOwn(jsonData.ageGroup, "from") ||
				!Object.hasOwn(jsonData.ageGroup, "to")
			) {
				try {
					const ageGroup = JSON.parse(jsonData.ageGroup as string);
					if (
						Number.isNaN(ageGroup.from) ||
						(ageGroup.to && Number.isNaN(ageGroup.to))
					)
						throw new Error("Invalid age group");

					jsonData.ageGroup = ageGroup;
				} catch {
					const ageGroup = {
						from: Number(jsonData["ageGroup.from"]),
						to: Number(jsonData["ageGroup.to"]),
					};

					jsonData.ageGroup =
						Number.isNaN(ageGroup.from) ||
						(jsonData["ageGroup.to"] && Number.isNaN(ageGroup.to))
							? undefined
							: ageGroup;
				}
			} else if (
				Number.isNaN(jsonData.ageGroup.from) ||
				(jsonData.ageGroup.to && Number.isNaN(jsonData.ageGroup.to))
			) {
				delete jsonData.ageGroup;
			}
		}

		if ((jsonData.file as File)?.arrayBuffer()) {
			try {
				const fileBuffer = await (jsonData.file as File).arrayBuffer();
				const fileLocation = ref(
					firebaseStorage,
					`user_avatars/${user._id.toString()}.jpg`,
				);
				const fileSnapshot = await uploadBytes(fileLocation, fileBuffer);

				jsonData.avatarUrl = await getDownloadURL(fileSnapshot.ref);
				jsonData._firebaseRef = `user_avatars/${user._id.toString()}.jpg`;
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

		if (jsonData.preferredGenres) {
			const allAvailableGenres =
				await BWDatabase.tables.BWGenres.find().toArray();
			if (!Array.isArray(jsonData.preferredGenres))
				jsonData.preferredGenres = [jsonData.preferredGenres];

			for (const genre of jsonData.preferredGenres) {
				if (!allAvailableGenres.find((g) => g._id.toString() === genre))
					return c.json({
						status: 400,
						message: "Invalid genre detected",
						data: {
							_id: genre,
						},
					});
			}
		}
		// 		if (jsonData.preferences) {
		// 			const allAvailableGenres = await BWDatabase.tables.BWGenres.find().toArray();
		//
		// 			if (typeof jsonData.preferences === "string") {
		// 				try {
		// 					const preferences = JSON.parse(jsonData.preferences);
		// 					for (const genre of preferences.genres || []) {
		// 						if (!allAvailableGenres.find((g) => g._id.toString() === genre))
		// 							return c.json({
		// 								status: 400,
		// 								message: "Invalid genre detected",
		// 								data: {
		// 									_id: genre,
		// 								},
		// 							});
		// 					}
		// 				} catch {
		//
		// 				}
		// 			} else {
		// 				for (const genre of jsonData.preferences.genres || []) {
		// 					if (!allAvailableGenres.find((g) => g._id.toString() === genre))
		// 						return c.json({
		// 							status: 400,
		// 							message: "Invalid genre detected",
		// 							data: {
		// 								_id: genre,
		// 							},
		// 						});
		// 				}
		// 			}
		// 		}

		const sanitizedData: BWUser = {
			_role: user._role,
			username: user.username,
			emailAddress: user.emailAddress,
			createdAt: user.createdAt,

			// password: jsonData.password,
			password: user.password,

			ageGroup: jsonData.ageGroup || user.ageGroup,
			birthDate: jsonData.birthDate || user.birthDate,
			contactAddress: jsonData.contactAddress || user.contactAddress,
			country: jsonData.country || user.country,
			fullName: jsonData.fullName || user.fullName,
			gender: jsonData.gender || user.gender,
			phoneAddress: jsonData.phoneAddress || user.phoneAddress,
			avatarUrl: jsonData.avatarUrl || user.avatarUrl,
			_firebaseRef: jsonData._firebaseRef || user._firebaseRef,

			preferredGenres: jsonData.preferredGenres || user.preferredGenres,
		};
		for (const key of Object.keys(sanitizedData)) {
			// @ts-ignore
			if (sanitizedData[key] === undefined) delete sanitizedData[key];
		}

		const taskUpdate = await BWDatabase.tables.BWUsers.updateOne(
			{
				_id: user._id,
			},
			{
				$set: sanitizedData,
			},
		);

		// track
		await ActivityLogManager.appendAction(
			user,
			null,
			"account.update",
			sanitizedData,
		);

		if (taskUpdate.acknowledged) {
			return taskUpdate.modifiedCount
				? c.json({
						status: 200,
						message: "Account updated",
				  })
				: c.json({ status: 400, message: "Account unchanged" }, 400);
		}

		App.error(`${user.username} failed to acknowledge database update`);
		return c.json(
			{
				status: 500,
				message: "Failed to update account",
			},
			500,
		);
	});
