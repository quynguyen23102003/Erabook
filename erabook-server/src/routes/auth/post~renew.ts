import { Context } from "hono";
import { App } from "../../modules/app.js";
import { SessionManager } from "../../modules/session/index.js";

export default async (c: Context) => {
	const json = await App.parseBody<{ refreshToken: string }>(c);

	// invalid request / missing variables
	if (!json || !json.refreshToken) {
		return c.json(
			{
				status: 400,
				message: "Missing arguments",
			},
			400,
		);
	}

	const sessionData = await SessionManager.refreshTokens(json.refreshToken);
	return sessionData
		? c.json({
				status: 200,
				message: "Session renewal",
				data: sessionData,
		  })
		: c.json(
				{
					status: 401,
					message: "Unauthorized",
				},
				401,
		  );
};
