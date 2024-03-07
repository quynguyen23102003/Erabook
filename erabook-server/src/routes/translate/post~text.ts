import { Context } from "hono";
import {
	LangCode,
	LanguageType,
	getTranslationText,
	isValidCode,
} from "lingva-scraper";
import { App } from "../../modules/app.js";
import { SessionManager } from "../../modules/session/index.js";

type Input = {
	source: LangCode<"source">;
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

		if (jsonData.source && !isValidCode(jsonData.source, LanguageType.SOURCE)) {
			return c.json(
				{
					status: 400,
					message: "Invalid source language",
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
			const translatedText = await getTranslationText(
				jsonData.source || "auto",
				jsonData.target,
				jsonData.query,
			);

			return c.json({
				status: 200,
				message: "OK",
				data: translatedText,
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
