import { createTransport } from "nodemailer";

export const transporter = createTransport({
	pool: true,
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: "otpmail.erabook@gmail.com",
		pass: "nmixzoghmzqkjkrh",
	},
});
