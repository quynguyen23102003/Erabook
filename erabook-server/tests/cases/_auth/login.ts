import { expect } from "chai";
import { it } from "mocha";
import { tokens } from "../../test.js";

export default function () {
	describe("/auth/login - valid credentials", function () {
		it("Should return a pair of access and refresh token", function (done) {
			fetch("http://localhost:3000/auth/login", {
				method: "POST",
				body: JSON.stringify({
					username: "acayrin@tuta.io",
					password: "11111111",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(200);
					expect(res).to.have.property("data").and.property("accessToken");
					expect(res).to.have.property("data").and.property("refreshToken");
					done();

					tokens.accessToken = res.data.accessToken;
					tokens.refreshToken = res.data.refreshToken;
				})
				.catch(done);
		});
	});
}
