import { existsSync, readFileSync } from "fs";
import { PDFExtract } from "pdf.js-extract";

const extractor = new PDFExtract();

const parseBookPage = async (contentUrl: string, page?: number) =>
	new Promise(async (resolve, reject) => {
		extractor.extractBuffer(
			existsSync(contentUrl)
				? readFileSync(contentUrl)
				: Buffer.from(await (await fetch(contentUrl)).arrayBuffer()),
			{
				firstPage: page,
				lastPage: page,
			},
			(err, pdf) => {
				if (err) {
					return reject(err);
				}

				let outputContent = "";
				for (const page of pdf.pages) {
					let lineBreakLength = 0;

					for (const index in page.content) {
						const lineNow = page.content[index];
						const lineBefore = page.content[Number(index) - 1];

						outputContent += lineNow.str;

						if (lineBreakLength > 0 && Math.floor(lineNow.y - lineBefore.y) / lineBreakLength >= 1.2) {
							for (let z = 1; z < Math.floor(lineNow.y - lineBefore.y) / lineBreakLength; z++) {
								outputContent += "\n";
							}
						}

						if (lineBefore && lineBefore.y !== lineNow.y) {
							outputContent += "\n";
							lineBreakLength = Math.floor(lineNow.y - lineBefore.y);
						}
					}

					if (pdf.pages.indexOf(page) < pdf.pages.length - 1) {
						outputContent += "\n";
					}
				}

				resolve(outputContent);
			}
		);
	});

parseBookPage("https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_PDF.pdf", 1).then(console.log);
