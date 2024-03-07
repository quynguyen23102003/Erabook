import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/account/details - fetch details of session user", function () {
		it("Should return details of account", function (done) {
			fetch("http://localhost:3000/account/details", {
				method: "GET",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);
					expect(res).to.have.property("data");

					expect(res).to.have.property("data").to.have.property("_id");
					expect(res).to.have.property("data").to.have.property("username");
					expect(res).to.have.property("data").to.have.property("emailAddress");
					expect(res).to.have.property("data").to.have.property("createdAt");

					expect(res).to.have.property("data").to.not.have.property("_role");
					expect(res).to.have.property("data").to.not.have.property("password");

					if (res.data.shelf?.at(0)) {
						expect(res.data.shelf[0]).to.have.property("bookId").lengthOf(24);
						expect(res.data.shelf[0]).to.have.property("lastPage");
						expect(res.data.shelf[0]).to.have.property("timestamp");
					}

					if (res.data.wishlist?.at(0)) {
						expect(res.data.shelf[0]).to.have.property("bookId").lengthOf(24);
						expect(res.data.shelf[0]).to.have.property("timestamp");
					}

					done();
				})
				.catch(done);
		});
	});
}
