import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/translate/text - translate given text", function () {
		it("Should return translated text in vietnamese", function (done) {
			fetch("http://localhost:3000/translate/text", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					source: "auto",
					target: "vi",
					query: "Hello",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);
					expect(res).to.have.property("data").equals("Xin chào");

					done();
				})
				.catch(done);
		});
	});
}
