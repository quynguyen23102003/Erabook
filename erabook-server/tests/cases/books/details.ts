import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/books/:bookId/details - book details", function () {
		it("Should return details of a single entry", function (done) {
			fetch("http://localhost:3000/books/6524e33765cd41ca72f98a00/details", {
				method: "GET",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);

					expect(res.data).to.have.property("_id");

					expect(res.data).to.have.property("author");
					expect(res.data).to.have.property("author").have.property("_id");

					expect(res.data).to.have.property("genres");
					expect(res.data).to.have.property("genres").length.greaterThan(0);

					expect(res.data).to.have.property("title");
					expect(res.data).to.have.property("description");

					expect(res.data).to.have.property("_user");
					expect(res.data).to.have.property("_user").have.property("isPurchased");

					expect(res.data).to.have.property("rating");

					done();
				})
				.catch(done);
		});
	});
}
