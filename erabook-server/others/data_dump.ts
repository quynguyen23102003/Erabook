import { readFileSync, readdirSync } from "fs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ObjectId } from "mongodb";
import { PDFExtract } from "pdf.js-extract";
import wiki from "wikipedia";
import { BWDatabase } from "../src/modules/database/index.js";
import { firebaseStorage } from "../src/modules/firebase/index.js";
import { compilePassword } from "../src/modules/password/index.js";

const extractor = new PDFExtract();
const entries: {
	title: string;
	author: string;
	genres: string[];
	source: string;
	year: number;
}[] = [
	{
		title: "Journey to the Center of the Earth",
		author: "Jules Verne",
		genres: ["Adventure", "Science fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=1HH0tli3I9Bs5y300Q4B615fq7VR9g0mj",
		year: 1864,
	},
	{
		title: "The Curse of Capistrano",
		author: "Johnston McCulley",
		genres: ["Adventure"],
		source:
			"https://drive.google.com/uc?export=download&id=1g5iXscWehV0mB3OkSsAoRaQ3HchwLHl1",
		year: 1919,
	},
	{
		title: "The Swiss Family Robinson",
		author: "Johann Wyss",
		genres: ["Adventure"],
		source:
			"https://drive.google.com/uc?export=download&id=1Ru6PqRwZvbpfIYbrb7VeaXPJHGJB-qx3",
		year: 1812,
	},
	{
		title: "Don Quixote",
		author: "Miguel de Cervantes",
		genres: ["Adventure"],
		source:
			"https://drive.google.com/uc?export=download&id=1kZ_FYRFQtWd_BWNyFfsZmx9w1YTZZNvR",
		year: 1605,
	},
	{
		title: "Twenty Thousand Leagues Under the Sea",
		author: "Jules Verne",
		genres: ["Adventure", "Science fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=1BOn-6NssqQhX9DqhvF0LD2A6zFZX3MGs",
		year: 1869,
	},
	{
		title: "Pride And Prejudice",
		author: "Jane Austen",
		genres: ["Romance"],
		source:
			"https://drive.google.com/uc?export=download&id=13wNf9xt5UctkuABzFMPooQILn1Q0zSef",
		year: 1813,
	},
	{
		title: "Anna Karenina",
		author: "Leo Tolstoy",
		genres: ["Romance"],
		source:
			"https://drive.google.com/uc?export=download&id=1aarcm3WSt3PuaoL1ExZ97YFRE4F6GveF",
		year: 1878,
	},
	{
		title: "Madame Bovary",
		author: "Gustave Flaubert",
		genres: ["Romance"],
		source:
			"https://drive.google.com/uc?export=download&id=1uGYYgntbjy_mOqJW8p6Y35OF46zasBpl",
		year: 1856,
	},
	{
		title: "Jane Eyre",
		author: "Charlotte Bronte",
		genres: ["Romance"],
		source:
			"https://drive.google.com/uc?export=download&id=13DRhKw5bZOBCGqIVGDPNTlsgaonLf4fu",
		year: 1847,
	},
	{
		title: "Wuthering Heights",
		author: "Emily Brontë",
		genres: ["Romance"],
		source:
			"https://drive.google.com/uc?export=download&id=1VLHCsW9qaRAfd5Y86cnXPjFA2JUdv3kf",
		year: 1847,
	},
	{
		title: "The Time Machine",
		author: "H. G. Wells",
		genres: ["Fantasy", "Science fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=13rI2Qbe7MVANsXYsSB9gAwFToqTTV7eW",
		year: 1895,
	},
	{
		title: "The Lost World",
		author: "Arthur Conan Doyle",
		genres: ["Science fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=1wUuSnc5r40T5wbWBWvu8mz1Ur8JM5jJ9",
		year: 1912,
	},
	{
		title: "Nineteen Eighty-Four",
		author: "George Orwell",
		genres: ["Science fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=1QzYwvyUMHqJlWDHZzUFVa9qNkI7KV6-m",
		year: 1949,
	},
	{
		title: "Frankenstein",
		author: "Mary Shelley",
		genres: ["Science fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=19kyE7OpsgzoVUgW3_ITvk4To7rAj9Fn9",
		year: 1818,
	},
	{
		title: "The War of the Worlds",
		author: "H. G. Wells",
		genres: ["Science fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=1R5kZA9b492cyJcJJ7YNkz3-oDFEaooFy",
		year: 1898,
	},
	{
		title: "Alice's Adventures in Wonderland",
		author: "Lewis Carroll",
		genres: ["Fantasy", "Children's fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=12dJgg_-8we2iukVLLmLMtAo9bluZ-qg7",
		year: 1865,
	},
	{
		title: "The Wonderful Wizard of Oz",
		author: "L. Frank Baum",
		genres: ["Fantasy", "Children's fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=1JnLbnZ82SXM96P_GQJKLjFpKXl7iH1Kv",
		year: 1900,
	},
	{
		title: "The Adventures of Pinocchio",
		author: "Carlo Collodi",
		genres: ["Fantasy", "Children's fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=1SUhCJV97PNCS9AwJaa74uFtBCvM8LHbu",
		year: 1883,
	},
	{
		title: "The Adventures of Sherlock Holmes",
		author: "Arthur Conan Doyle",
		genres: ["Detective"],
		source:
			"https://drive.google.com/uc?export=download&id=1kqmCm6SZQh3bCpNh6fb01HWkAgRDpwLg",
		year: 1892,
	},
	{
		title: "Through the Looking-Glass, and What Alice Found There",
		author: "Lewis Carroll",
		genres: ["Fantasy", "Children's fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=1zi6vG9TSPX1BeRmrTe8cmHHtLCsaNjEf",
		year: 1872,
	},
	{
		title: "Ozma of Oz",
		author: "L. Frank Baum",
		genres: ["Fantasy", "Children's fiction"],
		source:
			"https://drive.google.com/uc?export=download&id=1wUlmX9T4Ykrar6Csnz3ljU3DXxJNWYKN",
		year: 1907,
	},
	{
		title: "The Worm Ouroboros",
		author: "E. R. Eddison",
		genres: ["Fantasy"],
		source:
			"https://drive.google.com/uc?export=download&id=1v15FVi4FI4hvEMIDBPFsKJ7ZOrGN_4cy",
		year: 1922,
	},
	{
		title: "The Phantom of the Opera",
		author: "Gaston Leroux",
		genres: ["Gothic", "Theatre"],
		source:
			"https://drive.google.com/uc?export=download&id=13u7mQTDPufH_Bk6aOfRnX6zinpoHrylI",
		year: 1909,
	},
	{
		title: "Crime and Punishment",
		author: "Fyodor Dostoevsky",
		genres: ["Literary"],
		source:
			"https://drive.google.com/uc?export=download&id=133QEnTJMlDHfZLJBCio9k9CssXueAEzx",
		year: 1866,
	},
	{
		title: "The Woman in White",
		author: "Wilkie Collins",
		genres: ["Mystery", "Sensation"],
		source:
			"https://drive.google.com/uc?export=download&id=195TOhyjCXbbvz67R7ZwDM3l_7g56WVyn",
		year: 1859,
	},
	{
		title: "The Mysteries of Udolpho",
		author: "Ann Radcliffe",
		genres: ["Gothic"],
		source:
			"https://drive.google.com/uc?export=download&id=1rlOULr_W2Qe3lWcCy-Kc-uKtHmXTW7Hm",
		year: 1794,
	},
	{
		title: "The Secret Adversary",
		author: "Agatha Christie",
		genres: ["Crime"],
		source:
			"https://drive.google.com/uc?export=download&id=1KQYxxaeOCtYSNRq8wjBEXne9xSB2g6FJ",
		year: 1922,
	},
	{
		title: "The Murders In The Rue Morgue",
		author: "Edgar Allan Poe",
		genres: ["Short", "Detective"],
		source:
			"https://drive.google.com/uc?export=download&id=1mMKIGKrY9PzNaeSuhWW5zwb_Uj3FsrVr",
		year: 1841,
	},
	{
		title: "The Maltese Falcon",
		author: "Dashiell Hammett",
		genres: ["Detective"],
		source:
			"https://drive.google.com/uc?export=download&id=1psdvzJdBlGSW8r7sJSFW_uuofMIcPUwr",
		year: 1930,
	},
	{
		title: "The Mysterious Affair at Styles",
		author: "Agatha Christie",
		genres: ["Crime"],
		source:
			"https://drive.google.com/uc?export=download&id=1JhZSLwmsDQffjuSQhCfit--QwFlJ3eHh",
		year: 1920,
	},
	{
		title: "The Mystery of Marie Roget",
		author: "Edgar Allan Poe",
		genres: ["Detective", "Short"],
		source:
			"https://drive.google.com/uc?export=download&id=1g_USAudSEn4WlN5FEBnFhappaPtP5-eK",
		year: 1842,
	},
	{
		title: "The Boscombe Valley Mystery",
		author: "Arthur Conan Doyle",
		genres: ["Detective"],
		source:
			"https://drive.google.com/uc?export=download&id=1qLxePIaJPHugMlbc1wH1pvSj4mQsTcSL",
		year: 1891,
	},
	{
		title: "The Black Cat",
		author: "Edgar Allan Poe",
		genres: ["Short", "Horror", "Gothic"],
		source:
			"https://drive.google.com/uc?export=download&id=1FO5Q23KaV9p1CWl6YWD4E0mq_K2l-oIt",
		year: 1843,
	},
	{
		title: "The Memoirs of Sherlock Holmes",
		author: "Arthur Conan Doyle",
		genres: ["Detective"],
		source:
			"https://drive.google.com/uc?export=download&id=1z85Mjv63X4q-eay8k2wijlmNJgDgjjrd",
		year: 1893,
	},
	{
		title: "The Return of Sherlock Holmes",
		author: "Arthur Conan Doyle",
		genres: ["Detective"],
		source:
			"https://drive.google.com/uc?export=download&id=11ujh7G9siPdTZLGlQZhn5WaehlsjW0OU",
		year: 1905,
	},
	{
		title: "The Mystery of the Blue Train",
		author: "Agatha Christie",
		source:
			"https://drive.google.com/uc?export=download&id=1G8vMwrIIOwie0qwFY81sQf9QSnUSqrb3",
		genres: ["Detective"],
		year: 1928,
	},
	{
		title: "The Hound of the Baskervilles",
		author: "Arthur Conan Doyle",
		genres: ["Detective", "Gothic"],
		source:
			"https://drive.google.com/uc?export=download&id=1IaPLlBIbur5a1Fy7ApL8O5WQWijvISgg",
		year: 1901,
	},
	{
		title: "The Innocence of Father Brown",
		author: "G. K. Chesterton",
		genres: ["Detective"],
		source:
			"https://drive.google.com/uc?export=download&id=1I5ysBEG50nMfz_9o-_yqXjaDh2tM1Tz4",
		year: 1910,
	},
	{
		title: "The Greek Interpreter",
		author: "Arthur Conan Doyle",
		genres: ["Detective"],
		source:
			"https://drive.google.com/uc?export=download&id=1Yz7DiDB76zcgY--z-1voNx0r6rjasrJ5",
		year: 1893,
	},
];

(async () => {
	// await BWDatabase.tables.BWUsers.insertOne({
	// 	username: "administrator",
	// 	password: compilePassword("administrator"),
	// 	_role: "admin",
	// 	emailAddress: "admin@example.com",
	// 	createdAt: Date.now(),
	// });
	await Promise.all([
		BWDatabase.tables.BWRatings.deleteMany(),
		BWDatabase.tables.BWPurchases.deleteMany(),
		BWDatabase.tables.BWPaymentMethods.deleteMany(),
		BWDatabase.tables.BWActivityLog.deleteMany(),
	]);

	const users: { uid: ObjectId; pid: ObjectId }[] = [];

	for (const name of [
		"Amelia",
		"Watson",
		"Will",
		"Dumbledore",
		"Gandalf",
		"Epic Sax Guy",
		"Anna Huges",
		"John Doe",
		"Jane Doe",
		"Amber Heard",
		"Amogus Sus",
		"Bill Ford",
		"Stanford Pines",
		"Jill Bill",
		"Illya",
		"Jason Vorhees",
		"Michael Bay",
		"Jayna",
		"Bob Ross",
		"Maxwell the Cat",
	]) {
		await BWDatabase.tables.BWUsers.deleteOne({ fullName: name });

		const uid = (
			await BWDatabase.tables.BWUsers.insertOne({
				_role: "user",
				avatarUrl: "https://www.thispersondoesnotexist.com",
				fullName: name,
				username: name.replaceAll(" ", "_").toLowerCase(),
				emailAddress: `${name.replaceAll(" ", "_")}@example.com`,
				password: compilePassword(`${name}12345678`),
				ageGroup: {
					from: 18,
					to: Math.floor(Math.random() * (28 - 24 + 1)) + 24,
				},
				birthDate: "1/1/1970",
				contactAddress: "PO",
				gender: Math.random() > 0.5 ? "Nam" : "Nữ",
				country: "PO",
				createdAt: Date.now(),
			})
		).insertedId;

		await BWDatabase.tables.BWPaymentMethods.deleteOne({
			cardHolderName: name,
		});
		const pid = (
			await BWDatabase.tables.BWPaymentMethods.insertOne({
				_type: "mastercard",
				cardNumber: "123456789012",
				cardExpiration: "1/1/1970",
				cardHolderName: name,
				cardSecret: "123",
				_userId: new ObjectId(uid),
				timestamp: Date.now(),
			})
		).insertedId;

		users.push({
			uid,
			pid,
		});
	}

	const pdfs = readdirSync(
		"/GLOBAL_DATA_DRIVE/FPT Edu/Final Project/erabook-server/pdfs",
		{ recursive: true },
	);

	await Promise.all(
		entries.map(async (data) => {
			await BWDatabase.tables.BWBooks.deleteOne({ title: data.title });

			try {
				let wikipedia = await wiki.summary(data.title);
				if (wikipedia.type === "disambiguation") {
					wikipedia = await wiki.summary(
						(await wiki.search(`${data.title} ${data.author}`)).results[0]
							.title,
					);
				}

				// author section ======================================================================
				const author = await BWDatabase.tables.BWAuthors.findOne({
					name: data.author,
				});

				let authorId = author?._id;
				if (!authorId) {
					const wikipedia = await wiki.summary(data.author);
					authorId = (
						await BWDatabase.tables.BWAuthors.insertOne({
							name: data.author,
							biography: wikipedia.extract,
							portrait: wikipedia.originalimage.source,
						})
					).insertedId;
				}

				// genre section ==================================================================
				const genres: string[] = [];
				for (const genre of data.genres) {
					const find = await BWDatabase.tables.BWGenres.findOne({
						name: genre,
					});
					if (find) {
						genres.push(find._id.toString());
					} else {
						genres.push(
							(
								await BWDatabase.tables.BWGenres.insertOne({
									name: genre,
									description: (
										await wiki.summary(
											genre.endsWith("fiction") ? genre : `${genre} fiction`,
										)
									).extract,
								})
							).insertedId.toString(),
						);
					}
				}

				// book section ======================================================================================
				const sourceFile = readFileSync(
					`/GLOBAL_DATA_DRIVE/FPT Edu/Final Project/erabook-server/pdfs/${pdfs.find(
						(f) => {
							if (
								f.toString().toLowerCase().includes(data.title.toLowerCase())
							) {
								console.info(data.title, " ===== ", f);
								return true;
							}
							return false;
						},
					)}`,
				);
				// Buffer.from(
				// 	await (await fetch(data.source)).arrayBuffer(),
				// );

				const pdf = await extractor.extractBuffer(sourceFile, {});
				const price = Math.floor(Math.random() * (20 - 5 + 1)) + 5;

				const createdBookId = (
					await BWDatabase.tables.BWBooks.insertOne({
						_id: undefined,
						_authorId: authorId,
						_genreIds: genres,
						_sourceUrl: data.source,
						coverImage: wikipedia.originalimage.source,
						title: data.title,
						description: wikipedia.extract,
						language: "English",
						publicationYear: data.year,
						pageCount: pdf.pages?.length,
						createdAt: Date.now(),
						price: price,
						edition: "First edition",
						reprintYear: data.year,
						releaseDate: data.year,
					})
				).insertedId;

				try {
					const fileLocation = ref(
						firebaseStorage,
						`book_sources/${createdBookId}.pdf`,
					);
					const fileSnapshot = await uploadBytes(fileLocation, sourceFile);

					const _sourceUrl = await getDownloadURL(fileSnapshot.ref);
					const _sourceFirebaseRef = `book_sources/${createdBookId}.pdf`;

					await BWDatabase.tables.BWBooks.updateOne(
						{ _id: createdBookId },
						{
							$set: {
								_sourceUrl,
								_sourceFirebaseRef,
							},
						},
					);
				} catch (err) {
					console.error(`Failed to upload file content for: ${data.title}`);
					console.error(err);

					await BWDatabase.tables.BWBooks.deleteOne({ createdBookId });
				}

				await Promise.all([
					BWDatabase.tables.BWRatings.insertMany(
						users.map(({ uid }) => ({
							_favorites: [],
							_bookId: createdBookId,
							_userId: new ObjectId(uid),
							rating: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
							comment: "This is a test rating",
							postDate: Date.now(),
						})),
					),
					BWDatabase.tables.BWPurchases.insertMany(
						users.map(({ uid, pid }) => ({
							_bookIds: [createdBookId.toString()],
							_paymentMethodId: pid,
							_userId: new ObjectId(uid),
							timestamp: Date.now(),
							status: "success",
							totalAmount: price,
						})),
					),
				]);

				console.info(`Completed: ${data.title}`);
			} catch (err) {
				console.error(`Failed to add ${data.title}`);
				console.error(err);
			}
		}),
	);

	process.exit();
})();
