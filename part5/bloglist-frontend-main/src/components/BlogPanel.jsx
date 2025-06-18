import Blog from "./Blog";
import CreateBlog from "./CreateBlog";
import Togglable from "./Togglable";
import blogService from "../services/blogs";
import { useNotificationDispatch } from "../context/NotificationContext";

const BlogPanel = ({
  blogs,
  user,
  addBlog,
  handleLogout,
  blogFormRef,
  setBlogs
}) => {
  const dispatch = useNotificationDispatch();
  const handleLikes = async (blogId, blogLikes) => {
    const updatedBlog = await blogService.addLike(blogId, blogLikes + 1);
    dispatch({ type: "SUCCESS_NOTIFICATION", text: "blog voted!" });
    setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    setBlogs(
      blogs.map((blog) => (updatedBlog.id === blog.id ? updatedBlog : blog))
    );
  };

  const handleRemove = async (blogId) => {
    try {
      await blogService.remove(blogId);
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
      dispatch({ type: "SUCCESS_NOTIFICATION", text: "blog removed!" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    } catch (exception) {
      dispatch({ type: "ERROR_NOTIFICATION", text: "Could not remove blog" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
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
