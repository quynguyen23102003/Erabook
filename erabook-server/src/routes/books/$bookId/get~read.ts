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

const range = (start: number, end: number) =>
	Array.from({ length: end - start }, (_, k) => k + start);
export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		const bookId = c.req.param("bookId");
		if (bookId.length !== 24)
			return c.json({ status: 400, message: "Invalid ID" }, 400);

		const existingBookEntry = await BWDatabase.tables.BWBooks.aggregate<
			BWBook & {
				_user: { readingState: { lastPage: number; timestamp: number } };
			}
		>([
			{
				$match: {
					_id: new ObjectId(bookId),
				},
			},
			...MongoUserConditions.userGetReadingState(user),
		]).next();

		if (
			!existingBookEntry ||
			!(await OwnershipManager.hasBookOwnership(user._id, new ObjectId(bookId)))
		) {
			return c.json(
				{
					status: 404,
					message: "Not found",
				},
				404,
			);
		}

		let chapterIndex = Number(c.req.query("chapter"));
		let pageIndex = Number(c.req.query("page"));

		if (chapterIndex < 1) chapterIndex = 1;
		if (pageIndex < 1) pageIndex = 1;

		// default nothing specified, continue where user left off
		const { readingState } = existingBookEntry._user;

		const page = pageIndex || readingState?.lastPage || 1;
		const chapter: {
			title: string;
			description?: string;
			pageFrom?: number;
			pageTo?: number;
		} =
			chapterIndex && existingBookEntry.chapters
				? existingBookEntry.chapters[chapterIndex - 1]
				: existingBookEntry.chapters?.find(
						(chapter) => page >= chapter.pageFrom && page <= chapter.pageTo,
				  );

		// track
		await ReadingManager.setReadingPage(
			user,
			new ObjectId(bookId),
			Number(page),
		);
		await ActivityLogManager.appendAction(
			user,
			new ObjectId(bookId),
			"books.page.view",
			{ page },
		);
		// view count increment
		await BWDatabase.tables.BWBooks.updateOne(
			{
				_id: new ObjectId(bookId),
			},
			{
				$inc: {
					viewCount: 1,
				},
			},
		);

		// single tracking
		if (c.req.query("single"))
			return c.json({
				status: 200,
				message: "State updated",
				data: {
					lastPage: page,
					timestamp: Date.now(),
				},
			});

		return c.json({
			status: 200,
			message: "OK",
			data: {
				pagination: {
					type: chapter ? "chapter" : "page",
					pageIndex: chapter
						? range(chapter.pageFrom, chapter.pageTo).includes(page)
							? range(chapter.pageFrom, chapter.pageTo).indexOf(page)
							: 0
						: page,
					hasPrev: chapter
						? existingBookEntry.chapters[
								existingBookEntry.chapters.indexOf(chapter) - 1
						  ] !== undefined
						: page - 1 > 0 && page <= existingBookEntry.pageCount,
					hasNext: chapter
						? existingBookEntry.chapters[
								existingBookEntry.chapters.indexOf(chapter) + 1
						  ] !== undefined
						: page + 1 <= existingBookEntry.pageCount,
				},
				chapter: chapter ? chapter : {},
				content: chapter
					? await extractBookPage(
							existingBookEntry._sourceUrl,
							chapter.pageFrom,
							chapter.pageTo,
					  )
					: await extractBookPage(existingBookEntry._sourceUrl, page),
			},
		});
	});
