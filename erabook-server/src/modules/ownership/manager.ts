import { ObjectId } from "mongodb";
import { BWDatabase } from "../database/index.js";

const manager = {
	hasBookOwnership: async (userId: ObjectId, bookId: ObjectId) => {
		const existingBook = await BWDatabase.tables.BWBooks.findOne({
			_id: bookId,
		});

		if (!existingBook) {
			return false;
		}

		const existingPurchase = await BWDatabase.tables.BWPurchases.findOne({
			_userId: userId,
			_bookIds: bookId.toString(),
			status: "success",
		});

		return existingPurchase != null;
	},
};

export { manager as OwnershipManager };
