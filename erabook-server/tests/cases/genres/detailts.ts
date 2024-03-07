import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/genres/:genreId/details - genre details", function () {
		it("Should return details of single entry", function (done) {
			fetch("http://localhost:3000/genres/6524d98fc27204d6c0ece2c8/details", {
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
					expect(res.data).to.have.property("description");

					done();
				})
				.catch(done);
		});
	});
}
