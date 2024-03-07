import { ObjectId } from "mongodb";

// represent a purchase
// origin: none
export type BWPurchase = {
	_id?: ObjectId;
	_userId: ObjectId; // see BWUser.ts
	_bookIds: string[]; // see BWBook.ts
	_paymentMethodId: ObjectId; // see BWPaymentMenthod.ts

	status: "success" | "ongoing" | "failed";
	timestamp: number;
	totalAmount: number;
};
