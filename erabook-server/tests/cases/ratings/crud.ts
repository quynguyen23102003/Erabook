import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	let ratingId = "";

	describe("/ratings/:ratingId/[create/update/remove] - CRUD a rating", function () {
		it("Should create a rating", function (done) {
			fetch("http://localhost:3000/ratings/6524e33765cd41ca72f98a00/create", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					rating: 5,
					comment: "Test rating",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);
					expect(res).to.have.property("data").to.have.property("_id").lengthOf(24);

					ratingId = res.data._id;

					done();
				})
				.catch(done);
		});

		it("Should update a rating", function (done) {
			fetch("http://localhost:3000/ratings/6524e33765cd41ca72f98a00/update", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					_id: ratingId,
					rating: 4,
					comment: "Test rating",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);

					done();
				})
				.catch(done);
		});

		it("Should remove a rating", function (done) {
			fetch("http://localhost:3000/ratings/6524e33765cd41ca72f98a00/remove", {
				method: "DELETE",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					_id: ratingId,
				}),
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
