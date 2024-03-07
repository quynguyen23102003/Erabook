import { ObjectId } from "mongodb";

// represent an Author
// origin: Authors - mysql.sql
export type BWAuthor = {
	_id?: ObjectId;
	_firebaseRef?: string; // firebase storage ref, DO NOT TOUCH

	name: string;

	portrait?: string;
	biography?: string;
	nationality?: string;

	// ? unknown purposes
	contactAddress?: string;
	emailAddress?: string;
	phoneNumber?: string;
	birthDate?: string;
};
