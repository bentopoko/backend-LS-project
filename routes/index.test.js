const { TestWatcher } = require("jest");
const request = require("supertest");

const app = require("../app");

test("user_token_registration", async () => {
  const response = await request(app)
    .post("/users/actions/sign-up")

    .send({
      firstname: "john",
      lastname: "doe",
      mobile: "0606060606",
      email: "jd1@debug.com",
      pseudo: "wallace",
      password: "f12345678",
    });
  expect(typeof response.body.userLoggedIn.token).toBe("string");
});

test("password_validation_over_8_characters", async () => {
  const response = await request(app)
    .post("/users/actions/sign-up")

    .send({
      firstname: "john",
      lastname: "doe",
      mobile: "0606060606",
      email: "jdw2@debug.com",
      pseudo: "wallace",
      password: "12345678",
    });
  expect(typeof response.body.userLoggedIn.token).toBe("string");
});

test("password_error_below_8_characters", async () => {
  const response = await request(app)
    .post("/users/actions/sign-up")

    .send({
      firstname: "john",
      lastname: "doe",
      mobile: "0606060606",
      email: "jdw1@debug.com",
      pseudo: "wallace",
      password: "aaa",
    })
    .expect({
      result: false,
      error: { password: "Password must be over 8 characters" },
    });
});
