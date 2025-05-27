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

describe("get /api/users should work properly", () => {
  test("users are returned as json", async () => {
    await api
      .get("/api/users")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
  test("the unique identifier property of the user is named id (not _id)", async () => {
    const users = (await api.get("/api/users")).body;
    users.forEach((user) => {
      assert.ok(user.id, "Expected user to have an id property");
      assert.strictEqual(user._id, undefined, "Expected user not to have _id");
    });
  });
  test("it doesn't return the passwords", async () => {
    const users = (await api.get("/api/users")).body;
    users.forEach((user) => {
      assert.strictEqual(
        user.password,
        undefined,
        "Expected user not to have password"
      );
    });
  });
});

describe("post api/users should work properly", () => {
  test("making an HTTP POST request to /api/users URL successfully creates a new user", async () => {
    const startingUsers = (await User.find({})).length;
    const newUser = {
      username: "AragornTheDog",
      name: "Aragorn",
      password: "TheDog"
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect("Content-Type", /application\/json/);
    const endingUsers = (await User.find({})).length;
    assert.strictEqual(
      startingUsers + 1,
      endingUsers,
      "Expect to have more blogs after doing the post request"
    );
  });

  test("it should return a 400 status if the username or password is too short", async () => {
    const newUser = {
      username: "ab",
      name: "Shorty",
      password: "cd"
    };
    const response = await api.post("/api/users").send(newUser).expect(400);
    assert.equal(
      response.body.error,
      "The username or the password should have at least 3 characters"
    );
    const usersAtEnd = await User.find({});
    const usernames = usersAtEnd.map((user) => user.username);
    assert.ok(!usernames.includes(newUser.username));
  });

  test("it should return a 400 status if the username or password is missing", async () => {
    const newUser = {
      name: "Incompleted"
    };
    const response = await api.post("/api/users").send(newUser).expect(400);
    assert.equal(response.body.error, "A password or username is required");
    const usersAtEnd = await User.find({});
    const usernames = usersAtEnd.map((user) => user.username);
    assert.ok(!usernames.includes(newUser.username));
  });
});

after(async () => {
  await mongoose.connection.close();
});
