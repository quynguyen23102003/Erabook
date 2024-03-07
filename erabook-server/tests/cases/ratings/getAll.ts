import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/ratings/:bookId/getAll - get all ratings of a book", function () {
		it("Should return a list of ratings", function (done) {
			fetch("http://localhost:3000/ratings/6524e33765cd41ca72f98a00/getAll", {
				method: "GET",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);
					expect(res).to.have.property("data").length.greaterThan(0);

					expect(res.data[0]).to.have.property("_id");
					expect(res.data[0]).to.have.property("_user");
					expect(res.data[0]).to.have.property("_user").to.have.property("isFavorite");
					expect(res.data[0]).to.have.property("rating");
					expect(res.data[0]).to.have.property("postDate");
					expect(res.data[0]).to.have.property("favorites");

					expect(res.data[0]).to.have.property("author");
					expect(res.data[0]).to.have.property("author").have.property("_id");
					expect(res.data[0]).to.have.property("author").have.property("username");

					done();
				})
				.catch(done);
		});
	});
}
