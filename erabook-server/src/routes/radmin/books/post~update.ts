import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Context } from "hono";
import { ObjectId } from "mongodb";
import { PDFExtract } from "pdf.js-extract";
import { BWBook } from "../../../models/index.js";
import { App } from "../../../modules/app.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { firebaseStorage } from "../../../modules/firebase/index.js";
import { SessionManager } from "../../../modules/session/index.js";

const extractor = new PDFExtract();
export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const jsonData = await App.parseBody<BWBook>(c);
		if (!jsonData) return c.json({ status: 400, message: "Invalid body" }, 400);
		if (jsonData._id?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid book ID" }, 400);
		if (jsonData._genreIds && !Array.isArray(jsonData._genreIds)) {
			jsonData._genreIds = [jsonData._genreIds];
		}
		if (jsonData.chapters) {
			if (!Array.isArray(jsonData.chapters)) {
				jsonData.chapters = [jsonData.chapters];
			}

			if (jsonData.chapters.some((chap) => typeof chap === "string")) {
				try {
					jsonData.chapters = jsonData.chapters.map((chap) =>
						JSON.parse(chap as unknown as string),
					);
				} catch {
					return c.json(
						{
							status: 400,
							message:
								"Invalid chapter found, please verify that it is a valid JSON string.",
						},
						400,
					);
				}
			}

			if (
				jsonData.chapters.some(
					(chap) =>
						!chap.title ||
						(chap.pageFrom && chap.pageTo && chap.pageFrom > chap.pageTo) ||
						(chap.pageFrom && Number.isNaN(Number(chap.pageFrom))) ||
						(chap.pageTo && Number.isNaN(Number(chap.pageTo))),
				)
			) {
				return c.json(
					{
						status: 400,
						message:
							"Invalid chapter detected. Possible errors: invalid title, invalid pageFrom/pageTo, pageFrom is greater than pageTo",
					},
					400,
				);
			}
		}
		if (jsonData.targetAgeGroup) {
			if (
				typeof jsonData.targetAgeGroup === "string" ||
				!Object.hasOwn(jsonData.targetAgeGroup, "from") ||
				!Object.hasOwn(jsonData.targetAgeGroup, "to")
			) {
				try {
					const ageGroup = JSON.parse(jsonData.targetAgeGroup as string);
					if (
						Number.isNaN(ageGroup.from) ||
						(ageGroup.to && Number.isNaN(ageGroup.to))
					)
						throw new Error("Invalid age group");

					jsonData.targetAgeGroup = ageGroup;
				} catch {
					const ageGroup = {
						from: Number(jsonData["targetAgeGroup.from"]),
						to: Number(jsonData["targetAgeGroup.to"]),
					};

					if (
						Number.isNaN(ageGroup.from) ||
						(jsonData["targetAgeGroup.to"] && Number.isNaN(ageGroup.to))
					) {
						delete jsonData.targetAgeGroup;
					} else {
						jsonData.targetAgeGroup = ageGroup;
					}
				}
			} else if (
				Number.isNaN(jsonData.targetAgeGroup.from) ||
				(jsonData.targetAgeGroup.to && Number.isNaN(jsonData.targetAgeGroup.to))
			) {
				delete jsonData.targetAgeGroup;
			}
		}

		const _id = new ObjectId(jsonData._id);
		if (jsonData._authorId)
			jsonData._authorId = new ObjectId(jsonData._authorId);
		if ((jsonData.sourceFile as File)?.arrayBuffer()) {
			try {
				const fileBuffer = await (jsonData.sourceFile as File).arrayBuffer();
				const fileLocation = ref(
					firebaseStorage,
					`book_sources/${_id.toString()}.pdf`,
				);
				const fileSnapshot = await uploadBytes(fileLocation, fileBuffer);

				jsonData._sourceUrl = await getDownloadURL(fileSnapshot.ref);
				jsonData._sourceFirebaseRef = `book_sources/${_id.toString()}.pdf`;
				try {
					jsonData.pageCount = (
						await extractor.extractBuffer(Buffer.from(fileBuffer))
					).pages.length;
				} catch {
					return c.json({
						status: 400,
						message:
							"Invalid source material. Please verify that it is a valid PDF file.",
					});
				}
			} catch (err) {
				console.error(err);

				return c.json(
					{
						status: 500,
						message: "Failed to upload source material",
					},
					500,
				);
			}
		}

		if ((jsonData.coverFile as File)?.arrayBuffer()) {
			try {
				const fileBuffer = await (jsonData.coverFile as File).arrayBuffer();
				const fileLocation = ref(firebaseStorage, `book_covers/${_id}.jpg`);
				const fileSnapshot = await uploadBytes(fileLocation, fileBuffer);

				jsonData.coverImage = await getDownloadURL(fileSnapshot.ref);
				jsonData._coverFirebaseRef = `book_covers/${_id}.jpg`;
			} catch (err) {
				console.error(err);

				return c.json(
					{
						status: 500,
						message: "Failed to upload cover image",
					},
					500,
				);
			}
		}

		const sanitizedData: BWBook = {
			_authorId: jsonData._authorId,
			_genreIds: jsonData._genreIds,
			title: jsonData.title,
			description: jsonData.description,
			chapters: jsonData.chapters,
			edition: jsonData.edition,
			reprintYear: jsonData.reprintYear,
			releaseDate: jsonData.releaseDate,
			publicationYear: jsonData.publicationYear,
			price: jsonData.price,
			language: jsonData.language,
			targetAgeGroup: jsonData.targetAgeGroup,

			coverImage: jsonData.coverImage,
			_coverFirebaseRef: jsonData._coverFirebaseRef,
			_sourceUrl: jsonData._sourceUrl,
			_sourceFirebaseRef: jsonData._sourceFirebaseRef,
			pageCount: jsonData.pageCount,
		};

		for (const key of Object.keys(sanitizedData)) {
			// @ts-ignore
			if (sanitizedData[key] === undefined) delete sanitizedData[key];
		}

		const taskUpdate = await BWDatabase.tables.BWBooks.updateOne(
			{
				_id,
			},
			{
				$set: sanitizedData,
			},
		);

		if (taskUpdate.acknowledged) {
			return taskUpdate.modifiedCount
				? c.json({
						status: 200,
						message: "Book updated",
				  })
				: c.json(
						{
							status: 400,
							message: "Book unchanged",
						},
						400,
				  );
		}

		return c.json(
			{
				status: 500,
				message: "Failed to update book",
			},
			500,
		);
	});
