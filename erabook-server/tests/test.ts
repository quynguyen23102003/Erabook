import { readdirSync, statSync } from "fs";
import { after } from "mocha";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { App } from "../src/modules/app.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

const recursiveLookup = async (path: string, callback: (path: string) => Promise<unknown>): Promise<void> => {
	for (const name of readdirSync(path)) {
		if (statSync(`${path}/${name}`).isDirectory()) {
			await recursiveLookup(`${path}/${name}`, callback);
		} else {
			await callback(`${path}/${name}`);
		}
	}
};

export const tokens = {
	refreshToken: "",
	accessToken: "",
};
const startServer = () => {
	const app = new App({
		honoOptions: { strict: true },
		appOptions: { port: process.env.PORT || 3000, silent: true },
	});
	return app.serve();
};

it("start", async function () {
	this.timeout(0);

	await startServer();
	await recursiveLookup(join(__dirname, "./cases"), async (file) => await (await import(file)).default());
});

after(function () {
	setTimeout(() => process.exit(), 1000);
});
