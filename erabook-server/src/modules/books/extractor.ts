import { existsSync, readFileSync } from "fs";
import { PDFExtract } from "pdf.js-extract";

export const extractBookPage = async (
	contentUrl: string,
	startPage: number,
	endPage?: number,
): Promise<string[]> =>
	new Promise((resolve, reject) => {
		const extractor = new PDFExtract();

		fetch(contentUrl, {
			keepalive: true,
			headers: {
				"User-Agent":
					"Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0",
			},
		})
			.then((body) => body.arrayBuffer())
			.then((buffer) => {
				extractor
					.extractBuffer(
						existsSync(contentUrl)
							? readFileSync(contentUrl)
							: Buffer.from(buffer),
						{
							firstPage: startPage,
							lastPage: endPage ?? startPage,
							normalizeWhitespace: true,
						},
					)
					.then((pdf) => {
						const outputContent: string[] = [];
						for (const page of pdf.pages) {
							let pageContent = "";
							let lineBreakLength = 0;

							for (const index in page.content) {
								const lineNow = page.content[index];
								const lineBefore = page.content[Number(index) - 1];

								pageContent += lineNow.str;

								if (
									lineBreakLength > 0 &&
									Math.floor(lineNow.y - lineBefore.y) / lineBreakLength >= 1.2
								) {
									for (
										let z = 1;
										z < Math.floor(lineNow.y - lineBefore.y) / lineBreakLength;
										z++
									) {
										pageContent += "\n";
									}
								}

								if (lineBefore && lineBefore.y !== lineNow.y) {
									pageContent += "\n";
									lineBreakLength = Math.floor(lineNow.y - lineBefore.y);
								}
							}

							if (pdf.pages.indexOf(page) < pdf.pages.length - 1) {
								pageContent += "\n";
							}

							outputContent.push(pageContent);
						}

						resolve(outputContent);
					})
					.catch(reject);
			});
	});
