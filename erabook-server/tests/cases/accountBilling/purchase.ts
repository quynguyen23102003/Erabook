import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/account/billing/purchase - purchase a book", function () {
		it("Should return success", function (done) {
			fetch("http://localhost:3000/account/billing/purchase", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					_bookId: "6524e33765cd41ca72f98a00",
					_paymentMethodId: "65269004bb46c6283c16f438",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);

					done();
				})
				.catch(done);
		});

		it("Should return already owned", function (done) {
			fetch("http://localhost:3000/account/billing/purchase", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					_bookId: "6524e33765cd41ca72f98a00",
					_paymentMethodId: "65269004bb46c6283c16f438",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(400);

					done();
				})
				.catch(done);
		});

		it("Should return invalid payment method", function (done) {
			fetch("http://localhost:3000/account/billing/purchase", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					_bookId: "6524e33765cd41ca72f98a00",
					_paymentMethodId: "111111111111111111111111",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(400);

					done();
				})
				.catch(done);
		});
	});
}
