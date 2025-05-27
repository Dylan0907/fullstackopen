const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");
const User = require("../../model/user");
const bcrypt = require("bcrypt");
const api = supertest(app);

const initalUsers = [
  {
    username: "SamTheCat",
    name: "Sam",
    password: "TheCat"
  },
  {
    username: "NinaTheDog",
    name: "Nina",
    password: "TheDog"
  }
];

beforeEach(async () => {
  await User.deleteMany({});
  for (let i = 0; i < initalUsers.length; i++) {
    const user = initalUsers[i];
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(user.password, saltRounds);

    const newUserInDB = new User({
      username: user.username,
      passwordHash,
      name: user.name
    });

    await newUserInDB.save();
  }
});

describe("post /api/login should work properly", () => {
  test("One should be able to login correctly with valid credentials", async () => {
    const user = { username: "NinaTheDog", password: "TheDog" };
    const response = await api.post("/api/login").send(user).expect(200);
    const token = response.body.token;
    assert.ok(token, "Expected a token in the response");
    const tokenParts = token.split(".");
    assert.strictEqual(
      tokenParts.length,
      3,
      "Expected token to have three parts"
    );
  });
  test("Login fails with incorrect password", async () => {
    const user = { username: "NinaTheDog", password: "TheCat" };
    const response = await api.post("/api/login").send(user).expect(401);
    assert.equal(response.body.error, "invalid username or password");
  });
  test("Login fails with incorrect username", async () => {
    const user = { username: "BlackTheHorse", password: "TheHorse" };
    const response = await api.post("/api/login").send(user).expect(401);
    assert.equal(response.body.error, "invalid username or password");
  });
});

after(async () => {
  await mongoose.connection.close();
});
