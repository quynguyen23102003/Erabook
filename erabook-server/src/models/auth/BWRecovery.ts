import { ObjectId } from "mongodb";

export type BWRecovery = {
	_id?: ObjectId;

	emailAddress: string;
	code: string;
	isUsed: boolean;
	validUntil: number;
};
