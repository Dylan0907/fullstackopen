const { test, after, beforeEach, before, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../../app");
const Blog = require("../../model/blog");
const User = require("../../model/user");
const api = supertest(app);
const Types = mongoose.Types;
const nonExistingId = new Types.ObjectId();
const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  }
];

const newBlog = {
  title: "First class tests",
  author: "Robert C. Martin",
  url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
  likes: 10
};

describe("it should work when a GET request is made", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("the unique identifier property of the blog posts is named id (not _id)", async () => {
    const response = (await api.get("/api/blogs")).body;
    response.forEach((blog) => {
      assert.ok(blog.id, "Expected blog to have an id property");
      assert.strictEqual(blog._id, undefined, "Expected blog not to have _id");
    });
  });
});

describe("creation of a new blog", async () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    const passwordHash = await bcrypt.hash("testpass", 10);
    const newUser = new User({
      username: "testuser",
      passwordHash,
      name: "Test"
    });
    await newUser.save();
    const loginResponse = await api
      .post("/api/login")
      .send({ username: "testuser", password: "testpass" });
    authToken = loginResponse.body.token;
  });

  test("making an HTTP POST request to /api/blogs URL successfully creates a new blog", async () => {
    const startingBlogs = (await Blog.find({})).length;

    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const endingBlogs = (await Blog.find({})).length;
    assert.strictEqual(
      startingBlogs + 1,
      endingBlogs,
      "Expect to have more blogs after doing the post request"
    );
  });

  test("if the likes property is missing from the request, it will default to the value 0", async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const zeroLikesBlog = (await Blog.find({ title: newBlog.title }))[0];
    assert.strictEqual(zeroLikesBlog.likes, 0, "Expect to have 0 likes");
  });

  test("it should return a 400 status if the blog URL is missing", async () => {
    const newBlog = {
      title: "First class tests",
      author: "Robert C. Martin"
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("it should return a 400 status if it is missing the blog title", async () => {
    const newBlog = {
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });

  test("only an autorized user can create a blog", async () => {
    const response = await api.post("/api/blogs").send(newBlog).expect(401);
    assert.equal(response.body.error, "token missing");
  });
});

describe("deletion of a blog", () => {
  let tokenA;
  let tokenB;
  let blogId;

  const userA = { username: "userA", password: "passA" };
  const userB = { username: "userB", password: "passB" };

  before(async () => {
    await User.deleteMany({});
    await Blog.deleteMany({});

    await api.post("/api/users").send(userA);
    await api.post("/api/users").send(userB);

    const loginA = await api.post("/api/login").send(userA);
    const loginB = await api.post("/api/login").send(userB);

    tokenA = loginA.body.token;
    tokenB = loginB.body.token;

    const blogResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${tokenA}`)
      .send(newBlog);

    blogId = blogResponse.body.id;
  });
  test("succeeds with status code 204 if id is valid and the user is authorized", async () => {
    await api
      .delete(`/api/blogs/${blogId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(204);

    const blogsAfter = await api.get("/api/blogs");
    const ids = blogsAfter.body.map((b) => b.id);
    assert.ok(!ids.includes(blogId), "Blog ID should not exist anymore");
  });
  test("fails with a status code 401 if the user is not authorized", async () => {
    const blogResponse = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${tokenA}`)
      .send(newBlog);
    const res = await api
      .delete(`/api/blogs/${blogResponse.body.id}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .expect(401);
    assert.equal(res.body.error, "invalid user");
  });
  test("fails with a status code 404 when the blog id is wrong", async () => {
    const res = await api
      .delete(`/api/blogs/${nonExistingId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .expect(404);
    assert.equal(res.body.error, "there is no blog with that id");
  });
});

/* describe("modification of a blog", () => {
  const newLikes = 10;
  test("succeeds with valid data", async () => {
    const blogsAtStart = (
      await Blog.find({
        title: "Go To Statement Considered Harmful"
      })
    )[0];

    await api
      .put(`/api/blogs/${blogsAtStart.id}`)
      .send({ likes: newLikes })
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const updatedBlog = await Blog.findById(blogsAtStart.id);
    assert.strictEqual(updatedBlog.likes, newLikes);
  });

  test("fails with status code 400 if id is invalid", async () => {
    await api
      .put(`/api/blogs/${1234}invalid`)
      .send({ likes: newLikes })
      .expect(400);
  });
}); */

after(async () => {
  await mongoose.connection.close();
});
