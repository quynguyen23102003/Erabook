import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/books/:bookId/wishlist - book wishlisting", function () {
		it("Should add wishlist of this book entry", function (done) {
			fetch("http://localhost:3000/books/6524e33765cd41ca72f98a00/addWishlist", {
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

		it("Should remove wishlist of this book entry", function (done) {
			fetch("http://localhost:3000/books/6524e33765cd41ca72f98a00/removeWishlist", {
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
