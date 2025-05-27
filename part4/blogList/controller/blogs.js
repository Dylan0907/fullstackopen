const blogsRouter = require("express").Router();
const Blog = require("../model/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({}).populate("user");
  return response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const { author, likes, url, title } = request.body;

  const user = await request.user;

  const blog = new Blog({
    author: author,
    url: url,
    title: title,
    likes: likes ?? 0,
    user: user._id
  });
  if (!url || !title)
    return response.status(400).json({ error: "title or url missing" });
  const newBlog = await blog.save();
  user.blogs = user.blogs.concat(newBlog._id);
  await user.save();
  response.status(201).json(newBlog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return response
        .status(404)
        .json({ error: "there is no blog with that id" });
    }
    const user = request.user;

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: "invalid user" });
    }
    const filteredBlogs = user.blogs.filter(
      (blog) => blog._id.toString() !== id
    );
    user.blogs = filteredBlogs;
    await user.save();
    await blog.deleteOne();
    response.status(204).end();
  }
);

blogsRouter.put(
  "/:id",
  middleware.userExtractor,
  async (request, response, next) => {
    const { likes } = request.body;
    const currentBlog = await Blog.findById(request.params.id);

    if (!currentBlog) {
      return response.status(404).end();
    }

    currentBlog.likes = likes;

    const updatedBlog = await currentBlog.save();
    response.json(updatedBlog);
  }
);

module.exports = blogsRouter;
