import { createHash } from "crypto";

export const compilePassword = (password: string) => {
	const f1 = createHash("sha512").update(password).digest("hex");
	const f2 = createHash("sha512")
		.update(`${process.env.BW_SALT}${f1}`)
		.digest("hex");

	return `$${process.env.BW_SALT}$${f2}`;
};
