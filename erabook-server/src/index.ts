import { cors } from "hono/cors";
import { App } from "./modules/app.js";
import { logger } from "./modules/hono/index.js";

const app = new App({
	honoOptions: { strict: true },
	appOptions: { port: process.env.PORT || 3000 },
});
app.use("*", logger());

// CORS related shit
app.use(cors());
// app.options("*", cors());
// app.use("*", cors());

app.serve().catch(App.error);
