import { Context } from "hono";
import { LangCode, LanguageType, getAudio, isValidCode } from "lingva-scraper";
import { App } from "../../modules/app.js";
import { SessionManager } from "../../modules/session/index.js";

type Input = {
	isSlow?: boolean;
	target: LangCode<"target">;
	query: string;
};
export default async (c: Context) =>
	SessionManager.validateAccessTokenThenExecute(c, async () => {
		const jsonData = await App.parseBody<Input>(c);

		if (!jsonData || !jsonData.target || !jsonData.query) {
			return c.json(
				{
					status: 400,
					message: "Missing body",
				},
				400,
			);
		}

		if (!isValidCode(jsonData.target, LanguageType.TARGET)) {
			return c.json(
				{
					status: 400,
					message: "Invalid target language",
				},
				400,
			);
		}

		try {
			const audioResponse = await getAudio(
				jsonData.target,
				jsonData.query,
				jsonData.isSlow,
			);

			return c.json({
				status: 200,
				message: "OK",
				data: audioResponse,
			});
		} catch {
			return c.json(
				{
					status: 500,
					message: "Failed to translate text",
				},
				500,
			);
		}
	});
