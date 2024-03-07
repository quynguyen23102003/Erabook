import { ObjectId } from "mongodb";

// represent a Book's rating/comment
// origin: Reviews - mysql.sql
export type BWRating = {
	_id?: ObjectId;
	_userId: ObjectId; // see BWUser.ts
	_bookId: ObjectId; // see BWBook.ts
	_favorites: string[]; // an array of user IDs that favorited this rating

	rating: number; // scale from 1-5
	postDate: number;

	comment?: string; // optional comment
	attachments?: string[]; // an array of attachment urls
};
