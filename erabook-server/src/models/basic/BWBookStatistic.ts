import { ObjectId } from "mongodb";

export type BWBookStatistic = {
	_id: ObjectId; // will be the same as BWBook
	viewCount: number; // number of view/read count
	purchaseCount: number; // number of purchase count
	lastUpdated: number; // timestamp of when this was last updated
};
