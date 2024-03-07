import { Context } from "hono";
import { App } from "../../modules/app.js";
import { BWDatabase } from "../../modules/database/index.js";
import Mailer from "../../modules/mailer/index.js";

const subject = "Xác thực tài khoản";
const content = (rand: string[]) => `
<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
    <div style="background-color: #fff; border-radius: 10px; padding: 20px;">
        <h1 style="font-size: 24px; color: #333;">Mail xác nhận</h1>
        <p style="font-size: 16px; color: #666;">Bạn đang đăng ký tài khoản Erabook</p>
        <p style="font-size: 16px; color: #666;">Đừng chia sẻ mã này cho bất kì ai</p>
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
        	<div style="display: flex; justify-content: center; align-items: center; border: 1px solid #ccc; border-radius: 10px; padding: 10px; background-color: #f9f9f9;">
            ${rand
							.map(
								(number) =>
									`<div style="font-size: 32px; color: #333; margin: 0 5px;">${number}</div>`,
							)
							.join("")}
        	</div>
        </div>
        <p style="font-size: 16px; color: #666;">Hãy sử dụng mã trên để hoàn thành quá trình đăng ký.</p>
    </div>
</div>`;

export default async (c: Context) => {
	const json = await App.parseBody<{ emailAddress: string }>(c);

	if (!json?.emailAddress) {
		return c.json(
			{
				status: 400,
				message: "Missing arguments",
			},
			400,
		);
	}

	const account = await BWDatabase.tables.BWUsers.findOne({
		emailAddress: json.emailAddress,
	});
	// Not found
	if (!account) {
		return c.json(
			{
				status: 400,
				message: "Account not found",
			},
			400,
		);
	}

	const rand = Math.floor(1000 + Math.random() * 9000)
		.toString()
		.split("");

	// valid for 15 minutes
	const taskInsertOTP = await BWDatabase.tables.BWRecovery.insertOne({
		emailAddress: json.emailAddress,
		code: rand.join(""),
		isUsed: false,
		validUntil: Date.now() + 900 * 1e3,
	});

	// we won't verify the mail was sent or not
	const taskSendMail = await Mailer.sendEmail(
		json.emailAddress,
		subject,
		content(rand),
	);

	if (taskInsertOTP.acknowledged && taskSendMail) {
		return c.json({
			status: 200,
			message: "Mail will be sent if an account was found",
		});
	}

	if (taskInsertOTP.acknowledged) {
		App.error(`Mailer Failed to send mail to ${json.emailAddress}`);
	} else {
		App.error(`DB Failed to create otp for ${json.emailAddress}`);
	}

	return c.json(
		{
			status: 500,
			message: "Failed to send mail",
		},
		500,
	);
};
