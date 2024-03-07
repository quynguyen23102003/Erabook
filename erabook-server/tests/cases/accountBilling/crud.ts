import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	let paymentId = "";

	describe("/account/billing/ - CRUD of payment methods", function () {
		it("/getPaymentMethods - Should add payment method", function (done) {
			fetch("http://localhost:3000/account/billing/getPaymentMethods", {
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
						expect(res.data[0]).to.have.property("_type");
						expect(res.data[0]).to.have.property("bankName");
						expect(res.data[0]).to.have.property("cardNumber");
						expect(res.data[0]).to.have.property("cardHolderName");
						expect(res.data[0]).to.have.property("cardExpiration");

						expect(res.data[0]).to.not.have.property("cardSecret");
					}

					done();
				})
				.catch(done);
		});

		it("/addPaymentMethod - Should add payment method", function (done) {
			fetch("http://localhost:3000/account/billing/addPaymentMethod", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					_type: "visa",
					bankName: "visa",
					cardNumber: "111111111111",
					cardHolderName: "test",
					cardSecret: "111",
					cardExpiration: "11/11",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);
					expect(res).to.have.property("data").to.have.property("_id").lengthOf(24);

					paymentId = res.data._id;

					done();
				})
				.catch(done);
		});

		it("/updatePaymentMethod - Should update payment method", function (done) {
			fetch("http://localhost:3000/account/billing/updatePaymentMethod", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					_id: paymentId,
					bankName: `Test ${Math.floor(Math.random() * 1e3)}`,
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);

					done();
				})
				.catch(done);
		});

		it("/removePaymentMethod - Should remove payment method", function (done) {
			fetch("http://localhost:3000/account/billing/removePaymentMethod", {
				method: "DELETE",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					_id: paymentId,
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
