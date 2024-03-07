import { expect } from "chai";
import { it } from "mocha";

export default function () {
	describe("/auth/login - invalid credentials", function () {
		it("Should return status code 401", function (done) {
			fetch("http://localhost:3000/auth/login", {
				method: "POST",
				body: JSON.stringify({
					username: "test1234",
					password: "test1234",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").equals(400);
					expect(res).to.not.have.property("data");
					done();
				})
				.catch(done);
		});
	});
}
