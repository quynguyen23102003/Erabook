import { ObjectId } from "mongodb";

// represent a User
// origin: Users - mysql.sql
export type BWUser = {
	_id?: ObjectId;
	_role: "user" | "admin"; // server side only
	_isVerified?: boolean;
	// server side only, may be optional
	// depending on whether verification is required upon registering
	_firebaseRef?: string; // firebase storage ref, DO NOT TOUCH

	username: string;
	password: string;
	emailAddress: string;
	createdAt: number;

	avatarUrl?: string;
	fullName?: string;
	contactAddress?: string;
	country?: string;
	phoneAddress?: string;
	gender?: "Nam" | "Nữ" | "Khác";
	birthDate?: string;
	ageGroup?: {
		from?: number;
		to?: number;
	};

	// user's wish list
	// origin: FavoriteLists - mysql
	wishlist?: {
		bookId: ObjectId; // see BWBook.ts,
		timestamp: number;
		// quantity?: number; // unknown variable
	}[];

	// user's reading shelf
	// origin: ReadingHistory, ReadLists, PersonalBookshelves - mysql.sql
	// ...same as above
	shelf?: {
		bookId: ObjectId; // see BWBook.ts,
		lastPage: number; // last viewed page
		timestamp: number; // viewed timestamp
	}[];

	// user's preferred genre list
	preferredGenres?: string[];
};
