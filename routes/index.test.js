const { TestWatcher } = require("jest");
const request = require("supertest");

const app = require("../app");

test("user token registration", async () => {
  const response = await request(app)
    .post("/users/actions/sign-up")

    .send({
      firstname: "john",
      lastname: "doe",
      pseudo: "wallace",
      password: "fdgdgfghfjjghjgjhyt65",
    });
  expect(typeof response.body.token).toBe("string");
});

test("password_validation over 8 characters", async () => {
  const response = await request(app)
    .post("/users/actions/sign-up")

    .send({
      firstname: "john",
      lastname: "doe",
      pseudo: "wallace",
      password: "2143256547565785jh",
    });
  expect(typeof response.body.token).toBe("string");
});

test("password_error below 8 characters", async () => {
  const response = await request(app)
    .post("/users/actions/sign-up")

    .send({
      firstname: "john",
      lastname: "doe",
      pseudo: "wallace",
      password: "214325",
    })
    .expect({ result: false, err: "ups... invalid password" });
});
