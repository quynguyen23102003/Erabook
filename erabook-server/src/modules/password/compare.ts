import { compilePassword } from "./compile.js";

export const comparePassword = (check: string, base: string) =>
	compilePassword(check) === base;
