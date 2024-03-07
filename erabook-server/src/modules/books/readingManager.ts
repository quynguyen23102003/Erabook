import { ObjectId } from "mongodb";
import { BWUser } from "../../models/index.js";
import { BWDatabase } from "../database/index.js";

const manager = {
	// obsolete
	getReadingState: async (user: BWUser, bookId: ObjectId) => {
		const existingBook = await BWDatabase.tables.BWBooks.findOne({
			_id: new ObjectId(bookId),
		});
		const existingReadingEntry = user.shelf?.find(
			(b) => b.bookId.toString() === bookId.toString(),
		);
		const jsonData = {
			completed: false,
			lastPage: existingReadingEntry?.lastPage,
			totalPages: existingBook?.pageCount,
			percentageCompleted: Math.round(
				(existingReadingEntry?.lastPage / existingBook?.pageCount) * 100,
			),
		};

		if (existingReadingEntry && existingBook) {
			if (existingReadingEntry.lastPage === existingBook.pageCount) {
				jsonData.completed = true;
			}

			return jsonData;
		}

		return undefined;
	},
	setReadingPage: async (
		user: BWUser,
		bookId: ObjectId,
		pageNumber: number,
	) => {
		const existingReadingIndex = user.shelf?.findIndex(
			(b) => b.bookId.toString() === bookId.toString(),
		);

		if (existingReadingIndex === undefined || existingReadingIndex === -1) {
			await BWDatabase.tables.BWUsers.updateOne(
				{
					_id: user._id,
				},
				[
					{
						$set: {
							shelf: {
								$ifNull: [
									{
										$concatArrays: [
											"$shelf",
											[
												{
													bookId: new ObjectId(bookId),
													lastPage: Number(pageNumber),
													timestamp: Date.now(),
												},
											],
										],
									},
									[
										{
											bookId: new ObjectId(bookId),
											lastPage: Number(pageNumber),
											timestamp: Date.now(),
										},
									],
								],
							},
						},
					},
				],
			);

			return;
		}

		user.shelf[existingReadingIndex].bookId = new ObjectId(bookId.toString());
		user.shelf[existingReadingIndex].lastPage = Number(pageNumber);
		user.shelf[existingReadingIndex].timestamp = Date.now();

		await BWDatabase.tables.BWUsers.updateOne(
			{
				_id: user._id,
			},
			{
				$set: {
					shelf: user.shelf,
				},
			},
		);
	},
};

export { manager as ReadingManager };
