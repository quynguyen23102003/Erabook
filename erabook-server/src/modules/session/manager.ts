import { Context } from "hono";
import jsonwebtoken from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { BWUser } from "../../models/index.js";
import { ActivityLogManager } from "../activityLog/index.js";
import { App } from "../app.js";
import { BWDatabase } from "../database/index.js";
const { sign, verify, decode } = jsonwebtoken;

const charset =
	"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const randomString = (length = 16) => {
	let secret = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		secret += charset.charAt(randomIndex);
	}
	return secret;
};

const tokenConfig = {
	refreshToken: {
		timeout:
			process.env.APP_MODULE_SESSION_REFRESH_TOKEN_TIMEOUT || 3600 * 24 * 60, // 60 days
	},
	accessToken: {
		secretKey: process.env.JWT_ACCESS_SECRET || "AzSGw15@21K_STP",
		timeout: process.env.APP_MODULE_SESSION_ACCESS_TOKEN_TIMEOUT || 60 * 15, // 15 minutes
	},
};

const manager = {
	createTokens: async (
		userId: ObjectId,
	): Promise<{ refreshToken: string; accessToken: string } | undefined> => {
		const tokens = {
			refreshToken: await manager.createRefreshToken(userId),
			accessToken: manager.createAccessToken(userId),
		};

		return tokens.refreshToken ? tokens : undefined;
	},
	refreshTokens: async (
		refreshToken: string,
	): Promise<{ refreshToken: string; accessToken: string } | undefined> => {
		const userId = await manager.validateRefreshToken(refreshToken);

		if (!userId) {
			return undefined;
		}

		// track
		await ActivityLogManager.appendAction(userId, null, "auth.renew");

		return manager.createTokens(userId);
	},
	validateAccessToken: (token: string): string | undefined => {
		try {
			return (
				verify(token, tokenConfig.accessToken.secretKey) as { uid?: string }
			).uid;
		} catch {
			return undefined;
		}
	},
	validateRefreshToken: async (
		token: string,
	): Promise<ObjectId | undefined> => {
		try {
			const payload = decode(token) as { uid?: string; sec?: string };

			if (!payload.uid) {
				return undefined;
			}

			const existingEntry = await BWDatabase.tables.BWSession.findOne({
				_userId: new ObjectId(payload.uid),
			});
			if (!existingEntry) return undefined;

			verify(token, existingEntry.secret);

			return existingEntry._userId;
		} catch (e) {
			App.error("[Session] Failed to validate refresh token", e);

			return undefined;
		}
	},
	createAccessToken: (userId: string | ObjectId) => {
		const targetUserId =
			typeof userId === "string" ? new ObjectId(userId) : userId;

		return sign(
			{ uid: targetUserId.toString() },
			tokenConfig.accessToken.secretKey,
			{
				expiresIn: tokenConfig.accessToken.timeout,
			},
		);
	},
	createRefreshToken: async (
		userId: string | ObjectId,
	): Promise<string | undefined> => {
		const targetUserId =
			typeof userId === "string" ? new ObjectId(userId) : userId;

		await manager.deleteExistingRefreshTokens(targetUserId);

		const secret = randomString();
		const token = sign(
			{
				uid: userId.toString(),
			},
			secret,
			{
				expiresIn: tokenConfig.refreshToken.timeout,
			},
		);
		const taskInsertDb = await BWDatabase.tables.BWSession.insertOne({
			_userId: targetUserId,
			secret,
		});

		return taskInsertDb.acknowledged ? token : undefined;
	},
	deleteExistingRefreshTokens: async (userId: ObjectId) =>
		(
			await BWDatabase.tables.BWSession.deleteMany({
				_userId: userId,
			})
		).deletedCount,
	validateAccessTokenThenExecute: async (
		c: Context,
		callback: (user: BWUser) => Promise<Response>,
	) => {
		const authHeader = c.req.header("authorization");
		if (!authHeader || !authHeader.startsWith("Bearer")) {
			return c.json(
				{
					status: 401,
					message: "Unauthorized",
				},
				401,
			);
		}

		const authUid = manager.validateAccessToken(authHeader.split(" ")[1]);
		if (!authUid) {
			return c.json(
				{
					status: 401,
					message: "Unauthorized",
				},
				401,
			);
		}

		const userEntry = await BWDatabase.tables.BWUsers.findOne({
			_id: new ObjectId(authUid),
		});

		return userEntry
			? callback(userEntry)
			: c.json(
					{
						status: 401,
						message: "Unauthorized",
					},
					401,
			  );
	},
	validateAdministrativeUser: async (
		c: Context,
		callback: (user: BWUser) => Promise<Response>,
	) =>
		manager.validateAccessTokenThenExecute(c, async (user) => {
			if (user._role !== "admin")
				return c.json({ status: 404, message: "Not found" }, 404);
			callback(user);
		}),
};

export { manager as SessionManager };
