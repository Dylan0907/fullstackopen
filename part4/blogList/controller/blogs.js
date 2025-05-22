const blogsRouter = require("express").Router();
const Blog = require("../model/blog");

blogsRouter.get("/", async (request, response) => {
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

blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

blogsRouter.put("/:id", (request, response, next) => {
  const { title, author, url, likes } = request.body;

  Blog.findById(request.params.id)
    .then((blog) => {
      if (!blog) {
        return response.status(404).end();
      }

      blog.title = title;
      blog.author = author;
      blog.url = url;
      blog.likes = likes;

      return blog.save().then((updatedBlog) => {
        response.json(updatedBlog);
      });
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
