import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { Context } from "hono";
import { ObjectId } from "mongodb";
import { BWBook } from "../../../models/index.js";
import { ActivityLogManager } from "../../../modules/activityLog/index.js";
import {
	ReadingManager,
	extractBookPage,
} from "../../../modules/books/index.js";
import { BWDatabase } from "../../../modules/database/index.js";
import { MongoUserConditions } from "../../../modules/mongo/index.js";
import { OwnershipManager } from "../../../modules/ownership/index.js";
import { SessionManager } from "../../../modules/session/index.js";

// @ts-ignore
type ResponseFormat = {
	bookName: string;
	allChapters?: {
		chapterTitle: string;
		chapterContent: string;
	}[];
};

const getBookContent = async (
	sourceUrl: string,
	pageFrom = 1,
	pageTo?: number,
) => {
	const uid = createHash("md5")
		.update(`${sourceUrl}_${pageFrom}_${pageTo || ""}`)
		.digest("hex");

	if (!existsSync(resolve("./.cache"))) mkdirSync(resolve("./.cache"));

	if (existsSync(resolve(`./.cache/${uid}`))) {
		return readFileSync(resolve(`./.cache/${uid}`), "utf-8");
	}

	const content = (await extractBookPage(sourceUrl, pageFrom, pageTo)).join(
		" ",
	);

	writeFileSync(resolve(`./.cache/${uid}`), content, "utf-8");

	return content;
};

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const bookId = c.req.param("bookId");
		if (bookId.length !== 24)
			return c.json({ status: 400, message: "Invalid book ID" }, 400);

		const existingBookEntry = await BWDatabase.tables.BWBooks.aggregate<
			BWBook & {
				_user: { readingState: { lastPage: number; timestamp: number } };
			}
		>([
			{ $match: { _id: new ObjectId(bookId) } },
			...MongoUserConditions.userGetReadingState(user),
		]).next();
		if (
			!existingBookEntry ||
			(existingBookEntry.price > 0 &&
				!(await OwnershipManager.hasBookOwnership(
					user._id,
					new ObjectId(bookId),
				)))
		)
			return c.json({ status: 404, message: "Not found" }, 404);

		try {
			const allChapters: {
				chapterTitle: string;
				chapterContent: string;
			}[] = await Promise.all(
				existingBookEntry.chapters?.map(async (chapter) => {
					const { pageFrom, pageTo, title } = chapter;
					return {
						chapterTitle: title,
						chapterContent: await getBookContent(
							existingBookEntry._sourceUrl,
							pageFrom,
							pageTo,
						),
					};
				}) || [
					{
						chapterTitle: "All",
						chapterContent: await getBookContent(
							existingBookEntry._sourceUrl,
							1,
							existingBookEntry.pageCount,
						),
					},
				],
			);

			// track
			await Promise.all([
				ReadingManager.setReadingPage(user, new ObjectId(bookId), -1),
				ActivityLogManager.appendAction(
					user,
					new ObjectId(bookId),
					"books.page.view",
				),
			]);

			return c.json({
				status: 200,
				message: "OK",
				data: {
					bookName: existingBookEntry.title,
					allChapters,
				},
			});
		} catch (err) {
			console.error(err);

			return c.json(
				{
					status: 500,
					message: "Failed to load page, please try again later",
				},
				500,
			);
		}
	});
