const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../model/user");

usersRouter.get("/", async (_request, response) => {
  const users = await User.find({}).populate("blogs");

  response.status(200).json(users);
});

usersRouter.post("/", async (request, response) => {
  const { username, password, name } = request.body;

  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: "The username or the pass whouls have at least 3 characters"
    });
  }

  if (!username || !password) {
    return response.status(400).json({
      error: "A password or username is required"
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
    name
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser);
});

module.exports = usersRouter;
