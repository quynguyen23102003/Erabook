import { ObjectId } from "mongodb";

// represent a user payment method
// origin: none
export type BWPaymentMethod = {
	_id?: ObjectId;
	_type: "gpay" | "momo" | "visa" | "mastercard" | "zalopay";
	_userId: ObjectId; // see BWUser.ts

	timestamp: number;

	bankName?: string;

	cardHolderName: string;
	cardNumber: string;
	cardSecret: string;
	cardExpiration: string;
};
