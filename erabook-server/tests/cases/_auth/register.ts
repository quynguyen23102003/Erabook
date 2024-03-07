import { expect } from "chai";
import { it } from "mocha";

export default function () {
	describe("/auth/register", function () {
		it("Should throw a 'already signed up' error", function (done) {
			fetch("http://localhost:3000/auth/register", {
				method: "POST",
				body: JSON.stringify({
					username: "acayrin@tuta.io",
					emailAddress: "acayrin@tuta.io",
					password: "11111111",
				}),
			})
				.then((res) => res.json())
				.then((res) => {
					expect(res).to.have.property("status").not.equals(200);
					done();
				})
				.catch(done);
		});
	});
}
