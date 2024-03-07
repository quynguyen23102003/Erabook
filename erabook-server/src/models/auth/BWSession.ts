import { ObjectId } from "mongodb";

export type BWSession = {
	_id?: ObjectId;
	_userId?: ObjectId;

	secret: string;
};
