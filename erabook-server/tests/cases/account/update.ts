import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	const randomName = `Test ${Math.floor(Math.random() * 1e3)}`;

	describe("/account/update - update account details of session user", function () {
		it("Should return success", function (done) {
			fetch("http://localhost:3000/account/update", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					fullName: randomName,
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);

					done();
				})
				.catch(done);
		});

		it("Should return unchanged", function (done) {
			fetch("http://localhost:3000/account/update", {
				method: "POST",
				headers: {
					authorization: `Bearer ${tokens.accessToken}`,
				},
				body: JSON.stringify({
					fullName: randomName,
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
