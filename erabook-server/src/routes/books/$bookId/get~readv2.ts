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
	page: {
		content: string;
		hasNext: boolean;
		hasPrev: boolean;
	};
	chapter?: {
		title: string;
		description: string;
		pageFrom: number;
		pageTo: number;
		chapterIndex: number;
	};
};

const __VIEW_COUNT_TRACK_LIST: { [key: string]: number } = {};
const __CONTENT_CACHE: Map<string, { content: string; time: number }> =
	new Map();
setInterval(() => {
	// delete any cache that is more than 2 hours old
	for (const k of Object.keys(__CONTENT_CACHE))
		if (Date.now() - __CONTENT_CACHE.get(k).time >= 7200e3)
			__CONTENT_CACHE.delete(k);
}, 30e3);
const getCachedContent = async (book: BWBook, pageIndex: number) => {
	if (__CONTENT_CACHE.has(`${book._id.toString()}_${pageIndex}`)) {
		// update last access time
		__CONTENT_CACHE.set(`${book._id.toString()}_${pageIndex}`, {
			content: __CONTENT_CACHE.get(`${book._id.toString()}_${pageIndex}`)
				.content,
			time: Date.now(),
		});

		console.debug(
			`[Cache] ${book._id.toString()} Updated cache for page ${pageIndex}`,
		);
	} else {
		const extractedContent = (
			await extractBookPage(book._sourceUrl, pageIndex)
		).at(0);

		// create new cache entry
		__CONTENT_CACHE.set(`${book._id.toString()}_${pageIndex}`, {
			content: extractedContent,
			time: Date.now(),
		});

		console.debug(
			`[Cache] ${book._id.toString()} Created cache for page ${pageIndex}`,
		);
	}

	return __CONTENT_CACHE.get(`${book._id.toString()}_${pageIndex}`).content;
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
			!(await OwnershipManager.hasBookOwnership(user._id, new ObjectId(bookId)))
		)
			return c.json({ status: 404, message: "Not found" }, 404);

		let queryChapterIndex = Math.floor(Number(c.req.query("chapter")));
		let queryPageIndex = Math.floor(Number(c.req.query("page")));

		if (queryChapterIndex && queryChapterIndex < 1) queryChapterIndex = 1;
		if (queryPageIndex && queryPageIndex < 1) queryPageIndex = 1;
		queryChapterIndex--;

		// default nothing specified, continue where user left off
		const { readingState } = existingBookEntry._user;
		const targetPageIndex = queryPageIndex || readingState?.lastPage || 1;

		const matchingChapter =
			queryChapterIndex && existingBookEntry.chapters
				? existingBookEntry.chapters[queryChapterIndex]
				: existingBookEntry.chapters?.find(
						(chapter) =>
							targetPageIndex >= chapter.pageFrom &&
							targetPageIndex <= chapter.pageTo,
				  );
		const targetChapter: {
			title: string;
			description?: string;
			pageFrom?: number;
			pageTo?: number;
			chapterIndex: number;
		} = matchingChapter
			? {
					...matchingChapter,
					chapterIndex: existingBookEntry.chapters?.indexOf(matchingChapter),
			  }
			: undefined;

		setTimeout(async () => {
			for (const page of [targetPageIndex - 1, targetPageIndex + 1])
				try {
					await getCachedContent(existingBookEntry, page);
				} catch {
					console.error(
						`[Cache] ${existingBookEntry._id.toString()} Failed to cache page ${page}`,
					);
				}

			// track
			ReadingManager.setReadingPage(
				user,
				new ObjectId(bookId),
				Number(queryChapterIndex ? matchingChapter?.pageFrom : targetPageIndex),
			);
			ActivityLogManager.appendAction(
				user,
				new ObjectId(bookId),
				"books.page.view",
				{
					page: queryChapterIndex ? matchingChapter?.pageFrom : targetPageIndex,
				},
			);

			// view count increment
			if (Date.now() - __VIEW_COUNT_TRACK_LIST[user._id.toString()] >= 30e3) {
				__VIEW_COUNT_TRACK_LIST[user._id.toString()] = Date.now();

				await BWDatabase.tables.BWBooks.updateOne(
					{ _id: new ObjectId(bookId) },
					{ $inc: { viewCount: 1 } },
				);
			}
		});

		try {
			return c.json({
				status: 200,
				message: "OK",
				data: {
					page: {
						content: await getCachedContent(existingBookEntry, targetPageIndex),
						hasPrev:
							targetPageIndex - 1 > 0 &&
							targetPageIndex - 1 <= existingBookEntry.pageCount,
						hasNext: targetPageIndex + 1 <= existingBookEntry.pageCount,
						pageIndex: targetPageIndex,
					},
					chapter: targetChapter,
				},
			});
		} catch (err) {
			return c.json(
				{
					status: 500,
					message: "Failed to load page, please try again later",
				},
				500,
			);
		}
	});
