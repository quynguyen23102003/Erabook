import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Context } from "hono";
import { BodyData } from "hono/utils/body";
import { InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { PDFExtract } from "pdf.js-extract";
import { BWBook } from "../../../models";
import { BWDatabase } from "../../../modules/database/index.js";
import { firebaseStorage } from "../../../modules/firebase/index.js";
import { SessionManager } from "../../../modules/session/index.js";

const extractor = new PDFExtract();
export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		let jsonData: BodyData & BWBook;
		try {
			jsonData = await c.req.parseBody({ all: true });
		} catch {
			return c.json(
				{
					status: 400,
					message: "Request body must be a valid FormData",
				},
				400,
			);
		}

		const sanitizedData: BWBook = {
			// will be overridden
			_sourceUrl: "",
			pageCount: 0,

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
		};

		if (!sanitizedData._genreIds)
			return c.json({ status: 400, message: "Missing genre ID" }, 400);
		if (!Array.isArray(sanitizedData._genreIds))
			sanitizedData._genreIds = [sanitizedData._genreIds];
		if (sanitizedData._genreIds?.some((g) => g.toString().length !== 24))
			return c.json({ status: 400, message: "Invalid genre ID" }, 400);
		if (sanitizedData._authorId?.toString()?.length !== 24)
			return c.json({ status: 400, message: "Invalid author ID" }, 400);
		if (!sanitizedData.title)
			return c.json({ status: 400, message: "Missing title" }, 400);
		if (sanitizedData.chapters) {
			if (!Array.isArray(sanitizedData.chapters)) {
				sanitizedData.chapters = [sanitizedData.chapters];
			}

			try {
				sanitizedData.chapters = sanitizedData.chapters.map((chap) =>
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

			if (
				sanitizedData.chapters.some(
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
		try {
			const ageGroup = JSON.parse(jsonData.targetAgeGroup as string);
			if (Number.isNaN(ageGroup.from) || Number.isNaN(ageGroup.to))
				throw new Error("Invalid age group");

			sanitizedData.targetAgeGroup = ageGroup;
		} catch {
			const ageGroup = {
				from: Number(jsonData["targetAgeGroup.from"]),
				to: Number(jsonData["targetAgeGroup.to"]),
			};

			if (!Number.isNaN(ageGroup.from) && !Number.isNaN(ageGroup.to)) {
				sanitizedData.targetAgeGroup = ageGroup;
			}
		}

		sanitizedData._authorId = new ObjectId(sanitizedData._authorId);
		sanitizedData.createdAt = Date.now();

		if (!(jsonData.sourceFile as File)?.arrayBuffer()) {
			return c.json({ status: 400, message: "Missing source file" }, 400);
		}
		const sourceFile = await (jsonData.sourceFile as File).arrayBuffer();
		let coverFile: ArrayBuffer;
		if ((jsonData.coverFile as File)?.arrayBuffer()) {
			coverFile = await (jsonData.coverFile as File).arrayBuffer();
		}

		let taskCreate: InsertOneResult | UpdateResult =
			await BWDatabase.tables.BWBooks.insertOne(sanitizedData);
		const _id = taskCreate.insertedId;

		try {
			const fileLocation = ref(firebaseStorage, `book_sources/${_id}.pdf`);
			const fileSnapshot = await uploadBytes(fileLocation, sourceFile);

			sanitizedData._sourceUrl = await getDownloadURL(fileSnapshot.ref);
			sanitizedData._sourceFirebaseRef = `book_sources/${_id}.pdf`;
			try {
				sanitizedData.pageCount = (
					await extractor.extractBuffer(Buffer.from(sourceFile))
				).pages.length;
			} catch {
				await BWDatabase.tables.BWBooks.deleteOne({ _id });

				return c.json({
					status: 400,
					message:
						"Invalid source file. Please verify that it is a valid PDF file.",
				});
			}

			taskCreate = await BWDatabase.tables.BWBooks.updateOne(
				{ _id },
				{ $set: sanitizedData },
			);
		} catch (err) {
			console.error(err);

			await BWDatabase.tables.BWBooks.deleteOne({ _id });

			return c.json(
				{
					status: 500,
					message: "Failed to upload source file",
				},
				500,
			);
		}

		if (coverFile) {
			try {
				const fileLocation = ref(firebaseStorage, `book_covers/${_id}.jpg`);
				const fileSnapshot = await uploadBytes(fileLocation, coverFile);

				sanitizedData.coverImage = await getDownloadURL(fileSnapshot.ref);
				sanitizedData._coverFirebaseRef = `book_covers/${_id}.jpg`;

				taskCreate = await BWDatabase.tables.BWBooks.updateOne(
					{ _id },
					{ $set: sanitizedData },
				);
			} catch (err) {
				console.error(err);

				await BWDatabase.tables.BWBooks.deleteOne({ _id });

				return c.json(
					{
						status: 500,
						message: "Failed to upload cover image",
					},
					500,
				);
			}
		}

		return taskCreate.acknowledged
			? c.json({
					status: 200,
					message: "Book created",
					data: {
						_id,
					},
			  })
			: c.json(
					{
						status: 500,
						message: "Failed to create book",
					},
					500,
			  );
	});
