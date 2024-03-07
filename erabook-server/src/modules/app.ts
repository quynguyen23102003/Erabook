import { serve } from "@hono/node-server";
import "colors";
import { readdirSync, statSync } from "fs";
import { Context, Env, Hono, Next } from "hono";
import { BodyData } from "hono/utils/body";
import { cpus } from "os";
import { basename, dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

class App extends Hono {
	static readonly MaxConcurrency =
		Number(process.env.MAX_CONCURRENCY) || cpus().length - 1;

	static info = (...args: unknown[]) =>
		process.stdout.write(
			`${new Date().toISOString().grey} ${args.join(" ")}\n`,
		);
	static error = (...args: unknown[]) => {
		const errorIndex = args.findIndex((arg) => arg instanceof Error);
		let errorObject: Error;

		if (errorIndex !== -1) {
			errorObject = args.splice(errorIndex, 1)[0] as Error;
		}

		process.stdout.write(`${new Date().toISOString().red} ${args.join(" ")}\n`);
		errorObject && console.error(errorObject);
	};
	static warn = (...args: unknown[]) =>
		process.stdout.write(
			`${new Date().toISOString().yellow} ${args.join(" ")}\n`,
		);

	static parseBody = async <T = unknown>(c: Context): Promise<BodyData & T> => {
		let jsonData: BodyData & T;
		const bodyData: BodyData & T = await c.req.parseBody({ all: true });

		try {
			jsonData = await c.req.json();
		} catch {
			try {
				jsonData = bodyData;
			} catch (err) {
				console.error(err);
			}
		}

		return jsonData;
	};

	readonly froutes = new Map<string, (c: Context) => Promise<Response>>();
	#runTaskBefore: ((...args: unknown[]) => unknown)[] = [];
	#runTaskAfter: ((...args: unknown[]) => unknown)[] = [];

	readonly appOptions: {
		port?: string | number;
		silent?: boolean;
	};

	constructor(opts?: {
		honoOptions?: Partial<
			// biome-ignore lint/complexity/noBannedTypes: hono defaults
			Pick<Hono<Env, {}, "/">, "router" | "getPath"> & { strict: boolean }
		>;
		appOptions?: {
			port?: string | number;
			silent?: boolean;
		};
	}) {
		super(opts.honoOptions);

		if (opts?.appOptions) {
			this.appOptions = opts.appOptions;
		}
	}

	// [ Start server on PORT ] ========================================================================
	async serve() {
		if (!this.appOptions.silent)
			App.info(
				`Starting with max concurrency tasks: ${App.MaxConcurrency}`.green,
			);

		// Wait for all tasks to complete
		if (!this.appOptions.silent)
			App.info("Waiting for all tasks to complete...".yellow);
		for (const task of this.#runTaskBefore) await task(this);

		// Load routes
		await this.#loadRoutes();
		this.notFound((c) => c.json({ status: 404, message: "Not found" }, 404));

		// Start server
		serve({
			fetch: this.fetch,
			port: Number(this.appOptions?.port) || Number(process.env.PORT) || 8080,
		});

		// Finishing up
		if (!this.appOptions.silent)
			App.info(
				"Server started on port".green,
				(this.appOptions?.port?.toString() || "8080").blue,
			);

		// Running after tasks
		if (!this.appOptions.silent) App.info("Running post tasks...".yellow);
		Promise.all(this.#runTaskAfter.map((task) => task(this))).catch(
			console.error,
		);
	}

	// [ Load routes ] =================================================================================
	#loadRoutes = () =>
		recursiveLookup(join(__dirname, "../routes"), async (f) => {
			let file = f;
			let path = file
				.replace(join(__dirname, "../routes"), "")
				.replace(/(\.tsx)|(\.ts)|(\.js)/gi, "")
				.replace(/\$/gi, ":")
				.replace(/(index)|(_)/gi, "")
				.replace(/\\/gi, "/");

			// Windows specific
			if (process.platform === "win32") file = `file://${file}`;

			if (path.length > 1 && path.endsWith("/"))
				path = path.slice(0, path.length - 1);

			let reqType = "all";
			for (const type of ["get", "post", "put", "delete"]) {
				if (basename(file).toLowerCase().startsWith(`${type}~`)) {
					reqType = type;
					path = path.replace(new RegExp(`${type}~`, "gi"), "");
				} else {
					// @ts-ignore
					this[type](path, (c: Context) =>
						c.json({ status: 404, message: "Not found" }, 404),
					);
				}
			}

			this.froutes.set(path, (await import(file)).default);
			// @ts-ignore
			this[reqType](path, (await import(file)).default);

			if (!this.appOptions.silent)
				App.info(
					"Route",
					reqType.toUpperCase().yellow,
					path.cyan,
					"->",
					file.cyan,
				);
		});

	// [ Run tasks after serve ] ==========================================================================
	runTaskAfter(...tasks: ((...args: unknown[]) => unknown)[]) {
		this.#runTaskAfter = this.#runTaskAfter.concat(tasks);

		return this;
	}

	// [ Run tasks before serve ] =========================================================================
	runTaskBefore(...tasks: ((...args: unknown[]) => unknown)[]) {
		this.#runTaskBefore = this.#runTaskBefore.concat(tasks);

		return this;
	}

	// [ Alternate to .use() with App ] ===================================================================
	useWithApp(
		path: string,
		// biome-ignore lint/suspicious/noConfusingVoidType: hono defaults
		func: (c: Context, n: Next, app: App) => Promise<Response | void>,
	) {
		this.use(path, (ctx, nxt) => func(ctx, nxt, this));
	}
}

const recursiveLookup = async (
	path: string,
	callback: (path: string) => Promise<unknown>,
): Promise<void> => {
	for (const name of readdirSync(path)) {
		if (statSync(`${path}/${name}`).isDirectory()) {
			await recursiveLookup(`${path}/${name}`, callback);
		} else {
			await callback(`${path}/${name}`);
		}
	}
};

export { App };
