import { Context } from "hono";
import { Document, ObjectId } from "mongodb";
import { BWPurchase } from "../../../models";
import { BWDatabase } from "../../../modules/database/index.js";
import { SessionManager } from "../../../modules/session/index.js";

export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async (user) => {
		if (user._role !== "admin")
			return c.json({ status: 404, message: "Not found" }, 404);

		const condition: Document[] = [];
		const queryBookId = c.req.query("bookId");
		if (queryBookId && queryBookId.length === 24) {
			condition.push({ _bookId: new ObjectId(queryBookId) });
		}

		const _d = {
			total: await BWDatabase.tables.BWPurchases.aggregate<BWPurchase>([
				...condition,
				{ $project: { _id: 0, totalAmount: 1 } },
			]).toArray(),
			lastDay: await BWDatabase.tables.BWPurchases.aggregate<BWPurchase>([
				...condition,
				{ $match: { timestamp: { $gte: Date.now() - 1 * 24 * 3600 * 1e3 } } },
				{ $project: { _id: 0, totalAmount: 1 } },
			]).toArray(),
			lastWeek: await BWDatabase.tables.BWPurchases.aggregate<BWPurchase>([
				...condition,
				{ $match: { timestamp: { $gte: Date.now() - 7 * 24 * 3600 * 1e3 } } },
				{ $project: { _id: 0, totalAmount: 1 } },
			]).toArray(),
			lastMonth: await BWDatabase.tables.BWPurchases.aggregate<BWPurchase>([
				...condition,
				{ $match: { timestamp: { $gte: Date.now() - 30 * 24 * 3600 * 1e3 } } },
				{ $project: { _id: 0, totalAmount: 1 } },
			]).toArray(),
			last6Months: await BWDatabase.tables.BWPurchases.aggregate<BWPurchase>([
				...condition,
				{ $match: { timestamp: { $gte: Date.now() - 180 * 24 * 3600 * 1e3 } } },
				{ $project: { _id: 0, totalAmount: 1 } },
			]).toArray(),
			lastYear: await BWDatabase.tables.BWPurchases.aggregate<BWPurchase>([
				...condition,
				{ $match: { timestamp: { $gte: Date.now() - 365 * 24 * 3600 * 1e3 } } },
				{ $project: { _id: 0, totalAmount: 1 } },
			]).toArray(),
		};

		const data = {
			total: {
				count: _d.total.length,
				totalAmount:
					_d.total.length > 0
						? _d.total.reduce((a, b) => a + (b.totalAmount || 0), 0)
						: 0,
			},
			lastDay: {
				count: _d.lastDay.length,
				totalAmount:
					_d.lastDay.length > 0
						? _d.lastDay.reduce((a, b) => a + (b.totalAmount || 0), 0)
						: 0,
			},
			lastWeek: {
				count: _d.lastWeek.length,
				totalAmount:
					_d.lastWeek.length > 0
						? _d.lastWeek.reduce((a, b) => a + (b.totalAmount || 0), 0)
						: 0,
			},
			lastMonth: {
				count: _d.lastMonth.length,
				totalAmount:
					_d.lastMonth.length > 0
						? _d.lastMonth.reduce((a, b) => a + (b.totalAmount || 0), 0)
						: 0,
			},
			last6Months: {
				count: _d.last6Months.length,
				totalAmount:
					_d.last6Months.length > 0
						? _d.last6Months.reduce((a, b) => a + (b.totalAmount || 0), 0)
						: 0,
			},
			lastYear: {
				count: _d.lastYear.length,
				totalAmount:
					_d.lastYear.length > 0
						? _d.lastYear.reduce((a, b) => a + (b.totalAmount || 0), 0)
						: 0,
			},
		};

		return c.json({
			status: 200,
			message: "OK",
			data,
		});
	});
