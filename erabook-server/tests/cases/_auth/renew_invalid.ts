import { expect } from "chai";
import { it } from "mocha";

export default function () {
	describe("/auth/renew - invalid refresh token", function () {
		it("Should throw an error", function (done) {
			fetch("http://localhost:3000/auth/renew", {
				method: "POST",
				body: JSON.stringify({
					refreshToken: "test",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(401);
					expect(res).to.not.have.property("data");
					done();
				})
				.catch(done);
		});
	});
}
