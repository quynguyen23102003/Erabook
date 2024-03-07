import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/translate/audio - convert given text to speech", function () {
		it("Should return array of numbers as Uint8Array", function (done) {
			fetch("http://localhost:3000/translate/audio", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					target: "vi",
					query: "Xin chào",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);
					expect(res).to.have.property("data").length.greaterThan(0);

					done();
				})
				.catch(done);
		});
	});
}
