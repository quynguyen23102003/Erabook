import { ObjectId } from "mongodb";
import { BWUser } from "../../models/index.js";
import { BWDatabase } from "../database/index.js";

const manager = {
	appendAction: async (
		user: ObjectId | BWUser,
		target: string | ObjectId,
		type: string,
		data?: unknown,
	) => {
		if (!user || !type) {
			throw new Error("Missing argument(s)");
		}

		const _targetId: ObjectId =
			typeof target === "string" ? new ObjectId(target) : target;

		await BWDatabase.tables.BWActivityLog.insertOne({
			_userId: user instanceof ObjectId ? user : user._id,
			_targetId,
			type,
			timestamp: Date.now(),
			data,
		});
	},
};

export { manager as ActivityLogManager };
