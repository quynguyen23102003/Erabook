import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/ratings/:bookId/:ratingId/favorite - add/remove favorite of a rating", function () {
		it("Should add favorite", function (done) {
			fetch("http://localhost:3000/ratings/6524e33765cd41ca72f98a00/65389f73195fcd36279d1f18/addFavorite", {
				method: "GET",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);

					done();
				})
				.catch(done);
		});

		it("Should return already favorited", function (done) {
			fetch("http://localhost:3000/ratings/6524e33765cd41ca72f98a00/65389f73195fcd36279d1f18/addFavorite", {
				method: "GET",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(400);

					done();
				})
				.catch(done);
		});

		it("Should remove favorite", function (done) {
			fetch("http://localhost:3000/ratings/6524e33765cd41ca72f98a00/65389f73195fcd36279d1f18/removeFavorite", {
				method: "GET",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);

					done();
				})
				.catch(done);
		});
	});
}
