const blogsRouter = require("express").Router();
const Blog = require("../model/blog");

blogsRouter.get("/", async (_request, response) => {
  const blogs = await Blog.find({});
  return response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const { author, likes, url, title } = request.body;
  const blog = new Blog({
    author: author,
    url: url,
    title: title,
    likes: likes ?? 0
  });
  if (!url || !title)
    return response.status(400).json({ error: "title or url missing" });
  const newBlog = await blog.save();
  response.status(201).json(newBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response, next) => {
  const { likes } = request.body;
  const currentBlog = await Blog.findById(request.params.id);

  if (!currentBlog) {
    return response.status(404).end();
  }

  currentBlog.likes = likes;

  const updatedBlog = await currentBlog.save();
  response.json(updatedBlog);
});

module.exports = blogsRouter;
