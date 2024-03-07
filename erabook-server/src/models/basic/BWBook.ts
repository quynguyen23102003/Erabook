import { ObjectId } from "mongodb";

// represent a Book
// origin: Books - mysql.sql
export type BWBook = {
	_id?: ObjectId;
	_removalTimestamp?: number; // marked as removal timestamp, null otherwise
	_sourceFirebaseRef?: string; // firebase storage ref, DO NOT TOUCH
	_coverFirebaseRef?: string; // firebase storage ref, DO NOT TOUCH

	_authorId: ObjectId; // see BWAuthor.ts
	_genreIds: string[]; // see BWGenre.ts
	_sourceUrl: string; // source material URL in PDF format
	pageCount: number; // page count, must be exact as source's

	title: string;

	description?: string;
	releaseDate?: number;
	publicationYear?: number;
	reprintYear?: number;
	language?: string;
	edition?: string;
	coverImage?: string;
	targetAgeGroup?: {
		from?: number;
		to?: number;
	};

	// list of pages
	// 	pages: {
	// 		contentUrl: string; // should be a remote URL or local file path points to a PDF file
	// 		contentPageNumber: number; // which PDF page that this book page should parse from - this is only for server side
	//
	// 		pageNumber: number; // position of the page in the book - this is viewable by the users
	// 		timestamp: number; // posted timestamp
	// 	}[];

	// list of chapters
	chapters?: {
		title: string; // title, duh
		description?: string; // short description, if any
		pageFrom?: number; // starting page
		pageTo?: number; // ending page
	}[];

	// book pricing
	price?: number;
	// view count
	viewCount?: number;
	// creation timestamp
	createdAt?: number;
};
