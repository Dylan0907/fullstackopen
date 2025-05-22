const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../../app");
const Blog = require("../../model/blog");
const api = supertest(app);
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
  const blog = response[0];

  assert.ok(blog.id, "Expected blog to have an id property");
  assert.strictEqual(blog._id, undefined, "Expected blog not to have _id");
});

test("making an HTTP POST request to /api/blogs URL successfully creates a new blog", async () => {
  const startingBlogs = (await Blog.find({})).length;
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  };
  await api
    .post("/api/blogs")
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
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);
  const zeroLikesBlog = (await Blog.find({ title: newBlog.title }))[0];
  assert.strictEqual(zeroLikesBlog.likes, 0, "Expect to have 0 likes");
});

test("it should return a 400 status if there is missing the blog URL with POST request", async () => {
  const newBlog = {
    title: "First class tests",
    author: "Robert C. Martin"
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

test("it should return a 400 status if there is missing the blog title with POST request", async () => {
  const newBlog = {
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll"
  };
  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(400)
    .expect("Content-Type", /application\/json/);
});

after(async () => {
  await mongoose.connection.close();
});
