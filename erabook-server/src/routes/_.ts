import { Context } from "hono";

export default async (c: Context) =>
	c.json(
		{
			status: 404,
			message: "Not found",
		},
		404,
	);
