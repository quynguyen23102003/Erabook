import { App } from "../app.js";
import { transporter } from "./transporter.js";

const Mailer = {
	sendEmail: async (email: string, subject: string, content: string) => {
		try {
			const mailOptions = {
				from: "Erabook <no-reply@erabook.com>",
				to: email,
				subject,
				html: content,
			};

			return await transporter.sendMail(mailOptions);
		} catch (error) {
			App.error(error);
		}

		return false;
	},
};

export default Mailer;
