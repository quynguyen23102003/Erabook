import "colors";
import dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";
import {
	BWActivityLog,
	BWAuthor,
	BWBook,
	BWBookStatistic,
	BWGenre,
	BWPaymentMethod,
	BWPublisher,
	BWPurchase,
	BWRating,
	BWRecovery,
	BWSession,
	BWUser,
} from "../../models";
import { App } from "../app.js";
dotenv.config();

class Database extends MongoClient {
	connected = false;
	#mongoDatabases = new Map<string, Db>();

	constructor() {
		super(
			process.env.MONGODB_URI.replace(
				/%user%/gi,
				process.env.MONGODB_USER,
			).replace(
				/%password%/gi,
				encodeURIComponent(process.env.MONGODB_PASSWORD),
			),
			{
				compressors: "zlib",
				connectTimeoutMS: 10e3,
				serverSelectionTimeoutMS: 10e3,
			},
		);

		this.on("connectionReady", () => {
			this.connected = true;
		});
		this.on("error", (err) => {
			App.error(err);
		});
		this.on("timeout", () => {
			App.error("Task timed out");
		});
	}

	database(name: string) {
		this.#mongoDatabases.set(name, this.db(name));

		return this.#mongoDatabases.get(name);
	}

	collection(name: string, collection: string) {
		if (!this.#mongoDatabases.has(name)) this.database(name);

		return this.#mongoDatabases.get(name).collection(collection);
	}
}

const database = new Database().database("BookwormApp");
const data = {
	database,
	tables: {
		BWUsers: database.collection<BWUser>("BWUsers"),
		BWRecovery: database.collection<BWRecovery>("BWRecovery"),
		BWSession: database.collection<BWSession>("BWSessions"),
		BWBooks: database.collection<BWBook>("BWBooks"),
		BWGenres: database.collection<BWGenre>("BWGenres"),
		BWPublishers: database.collection<BWPublisher>("BWPublishers"),
		BWAuthors: database.collection<BWAuthor>("BWAuthors"),
		BWRatings: database.collection<BWRating>("BWRatings"),
		BWPurchases: database.collection<BWPurchase>("BWPurchases"),
		BWPaymentMethods: database.collection<BWPaymentMethod>("BWPaymentMenthods"),
		BWActivityLog: database.collection<BWActivityLog>("BWActivityLog"),
		BWBookStatistics: database.collection<BWBookStatistic>("BWBookStatistics"),
	},
};

export { data as Database };
