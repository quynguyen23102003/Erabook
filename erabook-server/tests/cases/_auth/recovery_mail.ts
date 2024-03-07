import { expect } from "chai";
import { it } from "mocha";

export default function () {
	describe("/auth/recoverySendMail", function () {
		it("Should send an email to user", function (done) {
			this.timeout(0);

			fetch("http://localhost:3000/auth/recoverySendMail", {
				method: "POST",
				body: JSON.stringify({
					emailAddress: "test@gmail.com",
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
