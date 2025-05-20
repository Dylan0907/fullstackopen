const blogsRouter = require("express").Router();
const Blog = require("../model/blog");

blogsRouter.get("/", (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs);
  });
});

blogsRouter.post("/", (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
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
