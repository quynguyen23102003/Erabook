import { expect } from "chai";
import { it } from "mocha";

export default function () {
	describe("/auth/login - invalid password length", function () {
		it("Should return status code 400", function (done) {
			fetch("http://localhost:3000/auth/login", {
				method: "POST",
				body: JSON.stringify({
					username: "test",
					password: "test",
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
