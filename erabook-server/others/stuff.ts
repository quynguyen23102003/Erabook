// import wiki from "wikipedia";
import { PDFExtract } from "pdf.js-extract";
import wiki from "wikipedia";
import { BWDatabase } from "../src/modules/database/index.js";

(async () => {
	// for (const author of await BWDatabase.tables.BWAuthors.find().toArray()) {
	// 	const img = await wiki.summary(author.name);
	// 	await BWDatabase.tables.BWAuthors.updateOne(
	// 		{
	// 			_id: author._id,
	// 		},
	// 		{
	// 			$set: {
	// 				portrait: img.originalimage.source,
	// 			},
	// 		}
	// 	);
	// }
	const extractor = new PDFExtract();
	const data = {
		title: "The Adventures of Sherlock Holmes",
		author: "Arthur Conan Doyle",
		genres: ["Detective"],
		source: "https://drive.google.com/uc?export=download&id=1Bagi3u_xrvPAdNfeSd3WEcH7gU7Du-Iq",
		year: 1892,
	};

	if (
		await BWDatabase.tables.BWBooks.findOne({
			title: data.title,
		})
	) {
		console.log(`Skipping ${data.title}`);
		return;
	}

	try {
		let wikipedia = await wiki.summary(data.title);
		if (wikipedia.type === "disambiguation") {
			wikipedia = await wiki.summary((await wiki.search(data.title + " " + data.author)).results[0].title);
		}

		const author = await BWDatabase.tables.BWAuthors.findOne({
			name: data.author,
		});

		let authorId = author?._id;
		if (!authorId) {
			authorId = (
				await BWDatabase.tables.BWAuthors.insertOne({
					name: data.author,
					biography: (await wiki.summary(data.author)).extract,
				})
			).insertedId;
		}

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
								await wiki.summary(genre.endsWith("fiction") ? genre : `${genre} fiction`)
							).extract,
						})
					).insertedId.toString()
				);
			}
		}

		const pdf = await extractor.extractBuffer(Buffer.from(await (await fetch(data.source)).arrayBuffer()), {});
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
				pageCount: pdf.pages.length,
				createdAt: Date.now(),
				price: price,
				edition: "First edition",
				reprintYear: data.year,
				releaseDate: data.year,
				chapters: [
					{
						title: "Adventure I. A Scandal in Bohemia",
						pageFrom: 1,
						pageTo: 18,
					},
					{
						title: "Adventure II. The Red-Headed League",
						pageFrom: 18,
						pageTo: 34,
					},
					{
						title: "Adventure III. A Case of Identity",
						pageFrom: 34,
						pageTo: 46,
					},
					{
						title: "Adventure IV. The Boscombe Valley Mystery",
						pageFrom: 46,
						pageTo: 64,
					},
					{
						title: "Adventure V. The Five Orange Pips",
						pageFrom: 64,
						pageTo: 77,
					},
					{
						title: "Adventure VI. The Man with The Twisted Lip",
						pageFrom: 77,
						pageTo: 94,
					},
					{
						title: "Adventure VII. The Adventure of The Blue Carbuncle",
						pageFrom: 94,
						pageTo: 109,
					},
					{
						title: "Adventure VIII. The Adventure of The Speckled Band",
						pageFrom: 109,
						pageTo: 127,
					},
					{
						title: "Adventure IX. The Adventure of The Engineer's Thumb",
						pageFrom: 127,
						pageTo: 141,
					},
					{
						title: "Adventure X. The Adventure of The Noble Bachelor",
						pageFrom: 141,
						pageTo: 157,
					},
					{
						title: "Adventure XI. The Adventure of The Beryl Coronet",
						pageFrom: 157,
						pageTo: 174,
					},
					{
						title: "Adventure XII. The Adventure of The Copper Beeches",
						pageFrom: 174,
						pageTo: 191,
					},
				],
			})
		).insertedId;

		console.info(createdBookId.toString());
	} catch (e) {
		console.error(e);
	}

	process.exit();
})();
