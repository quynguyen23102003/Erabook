import { ObjectId } from "mongodb";

// represent a Book genre
// origin: Genres - mysql.sql
export type BWGenre = {
	_id?: ObjectId;

	name: string;
	description: string;
	coverImage?: string;
};
