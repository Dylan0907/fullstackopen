import { useRef } from "react";
import Blog from "./Blog";
import CreateBlog from "./CreateBlog";
import Togglable from "./Togglable";
import blogService from "../services/blogs";
import { useNotificationDispatch } from "../context/NotificationContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const BlogPanel = ({ blogs, user, handleLogout }) => {
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();
  const blogFormRef = useRef();

  const voteBlogMutation = useMutation({
    mutationFn: blogService.addLike,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => (updatedBlog.id === blog.id ? updatedBlog : blog))
      );
      dispatch({ type: "SUCCESS_NOTIFICATION", text: "blog voted!" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    },
    onError: (e) => {
      dispatch({ type: "ERROR_NOTIFICATION", text: "Could not vote blog" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data, blogId) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.filter((blog) => blog.id !== blogId)
      );
      dispatch({
        text: `the blog was deleted successfully!`,
        type: "SUCCESS_NOTIFICATION"
      });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    },
    onError: (e) => {
      dispatch({ type: "ERROR_NOTIFICATION", text: "Could not remove blog" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  });

  return (
    <>
      <h1>Blogs</h1>
      <div>
        <p>{`${user.name} logged in`}</p>
        <button onClick={() => handleLogout()}>logout</button>
      </div>
      <Togglable buttonLabel={"New Blog"} ref={blogFormRef}>
        <CreateBlog blogFormRef={blogFormRef} />
      </Togglable>
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLikes={() =>
              voteBlogMutation.mutate({
                blogId: blog.id,
                likes: blog.likes + 1
              })
            }
            user={user}
            handleRemove={() => deleteBlogMutation.mutate(blog.id)}
          />
        ))}
      </div>
    </>
  );
};

export default BlogPanel;
