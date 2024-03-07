import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/account/billing/history - fetch purchase history", function () {
		it("Should return list of purchases", function (done) {
			fetch("http://localhost:3000/account/billing/history", {
				method: "GET",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);
					expect(res).to.have.property("data").length.greaterThanOrEqual(0);

					if (res.data.length > 0) {
						expect(res.data[0]).to.have.property("_id");
						expect(res.data[0]).to.have.property("_bookId");
						expect(res.data[0]).to.have.property("_paymentMethodId");
					}

					done();
				})
				.catch(done);
		});
	});
}
