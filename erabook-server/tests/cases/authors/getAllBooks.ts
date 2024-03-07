import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/authors/:authorId/getAllBooks - get all author's books", function () {
		it("Should return list of books", function (done) {
			fetch("http://localhost:3000/authors/6524ecefbb44cd2629bccc4d/getAllBooks", {
				method: "GET",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);
					expect(res).to.have.property("data").length.greaterThan(0);

					expect(res.data[0]).to.have.property("author");
					expect(res.data[0]).to.have.property("author").have.property("_id");

					expect(res.data[0]).to.have.property("genres");
					expect(res.data[0]).to.have.property("genres").length.greaterThan(0);

					expect(res.data[0]).to.have.property("title");
					expect(res.data[0]).to.have.property("description");

					expect(res.data[0]).to.have.property("_user");
					expect(res.data[0]).to.have.property("_user").have.property("isPurchased");

					done();
				})
				.catch(done);
		});
	});
}
