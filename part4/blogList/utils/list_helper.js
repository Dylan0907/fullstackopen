const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let total = 0;
  blogs?.forEach((blog) => {
    total += blog.likes;
  });
  return total;
};

const favoriteblog = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) return null;
  return blogs.reduce((favorite, blog) =>
    blog.likes > favorite.likes ? blog : favorite
  );
};

const mostBlogs = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) return null;
  const authorCount = [];
  blogs.forEach((blog) => {
    const existing = authorCount.find(
      (element) => element.author === blog.author
    );
    if (existing) {
      existing.blogs += 1;
    } else {
      authorCount.push({ author: blog.author, blogs: 1 });
    }
  });
  return authorCount.reduce((topAuthor, author) =>
    topAuthor.blogs > author.blogs ? topAuthor : author
  );
};

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) return null;
  const authorCount = [];
  blogs.forEach((blog) => {
    const existing = authorCount.find(
      (element) => element.author === blog.author
    );
    if (existing) {
      existing.likes += blog.likes;
    } else {
      authorCount.push({ author: blog.author, likes: blog.likes });
    }
  });
  return authorCount.reduce((topAuthor, author) =>
    topAuthor.likes > author.likes ? topAuthor : author
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteblog,
  mostBlogs,
  mostLikes
};
