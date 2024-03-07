import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/genres/getAll - get all available genres", function () {
		it("Should return a list of genres", function (done) {
			fetch("http://localhost:3000/genres/getAll", {
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
					expect(res.data[0]).to.have.property("name");
					expect(res.data[0]).to.have.property("description");

					done();
				})
				.catch(done);
		});
	});
}
