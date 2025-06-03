import Blog from "./Blog";
import CreateBlog from "./CreateBlog";
import Togglable from "./Togglable";
import blogService from "../services/blogs";

const BlogPanel = ({
  blogs,
  user,
  addBlog,
  handleLogout,
  blogFormRef,
  setBlogs
}) => {
  const handleLikes = async (blogId, blogLikes) => {
    const updatedBlog = await blogService.addLike(blogId, blogLikes + 1);

    setBlogs(
      blogs.map((blog) => (updatedBlog.id === blog.id ? updatedBlog : blog))
    );
  };

  const handleRemove = async (blogId) => {
    try {
      await blogService.remove(blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } catch (exception) {}
  };

  return (
    <>
      <h1>Blogs</h1>
      <div>
        <p>{`${user.name} logged in`}</p>
        <button onClick={() => handleLogout()}>logout</button>
      </div>
      <Togglable buttonLabel={"New Blog"} ref={blogFormRef}>
        <CreateBlog addBlog={addBlog} setBlogs={setBlogs} />
      </Togglable>
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLikes={handleLikes}
            user={user}
            handleRemove={handleRemove}
          />
        ))}
      </div>
    </>
  );
};

export default BlogPanel;
