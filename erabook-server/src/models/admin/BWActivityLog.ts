import { ObjectId } from "mongodb";

// user activity tracking?
// origin: ActivityLogs - mysql.sql
export type BWActivityLog<T = unknown> = {
	_id?: ObjectId;
	_userId: ObjectId; // see BWUser.ts,
	_targetId: ObjectId; // ID of target object

	type: string;
	timestamp: number;
	data?: T;
};
