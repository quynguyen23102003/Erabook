import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/authors/:authorId/details - author details", function () {
		it("Should return details of a single entry", function (done) {
			fetch("http://localhost:3000/authors/6524dec4cbb4df252cdc81ae/details", {
				method: "GET",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);

					expect(res.data).to.have.property("_id");
					expect(res.data).to.have.property("name");
					expect(res.data).to.have.property("biography");

					done();
				})
				.catch(done);
		});
	});
}
