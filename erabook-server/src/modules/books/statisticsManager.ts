import { ObjectId } from "mongodb";
import { BWBookStatistic } from "../../models";
import { BWDatabase } from "../database/index.js";

let checked = false;
const manager = {
	setup: async () => {
		if (
			!(await BWDatabase.tables.BWBookStatistics.indexExists("lastUpdated"))
		) {
			await BWDatabase.tables.BWBookStatistics.createIndex(
				{
					lastUpdated: 1,
				},
				{ expireAfterSeconds: 3600 * 24 * 7 }, // 7 days
			);
		}

		checked = true;
	},

	getBookEntry: async (bookId: ObjectId | string) => {
		if (!checked) await manager.setup();

		const existingEntry =
			await BWDatabase.tables.BWBookStatistics.aggregate<BWBookStatistic>([
				{
					$match: {
						_id: bookId instanceof ObjectId ? bookId : new ObjectId(bookId),
					},
				},
			]).next();

		const timestamp = existingEntry?.lastUpdated || Date.now();
		if (!existingEntry) {
			await BWDatabase.tables.BWBookStatistics.insertOne({
				_id: bookId instanceof ObjectId ? bookId : new ObjectId(bookId),
				viewCount: 0,
				purchaseCount: 0,
				lastUpdated: timestamp,
			});
		}

		return {
			_id: bookId instanceof ObjectId ? bookId : new ObjectId(bookId),
			viewCount: existingEntry?.viewCount,
			purchaseCount: existingEntry?.purchaseCount,
			lastUpdated: timestamp,
		};
	},

	updateBookViewCount: async (bookId: ObjectId | string) => {
		const entry = await manager.getBookEntry(bookId);

		await BWDatabase.tables.BWBookStatistics.updateOne(
			{
				_id: entry._id,
			},
			{
				$set: {
					lastUpdated: Date.now(),
				},
				$inc: {
					viewCount: 1,
				},
			},
		);
	},

	updateBookPurchaseCount: async (bookId: ObjectId | string) => {
		const entry = await manager.getBookEntry(bookId);

		await BWDatabase.tables.BWBookStatistics.updateOne(
			{
				_id: entry._id,
			},
			{
				$set: {
					lastUpdated: Date.now(),
				},
				$inc: {
					purchaseCount: 1,
				},
			},
		);
	},
};

export { manager as BookStatisticsManager };
