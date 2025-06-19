import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useNotificationDispatch } from "../context/NotificationContext";

const CreateBlog = ({ blogFormRef }) => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: ""
  });

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(["blogs"], blogs.concat(newBlog));
      dispatch({
        text: `A new blog You're not going to need it!`,
        type: "SUCCESS_NOTIFICATION"
      });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    },
    onError: (e) => {
      dispatch({
        text: "Could not create a new blog",
        type: "ERROR_NOTIFICATION"
      });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({
      ...newBlog,
      [name]: value
    });
  };

  const handleNewBlog = async (event) => {
    event.preventDefault();
    newBlogMutation.mutate(newBlog);
    blogFormRef.current.toggleVisibility();
    setNewBlog({
      title: "",
      author: "",
      url: ""
    });
  };

  return (
    <>
      <h2>Create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="author">Author</label>
          <input
            id="author"
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="url">URL</label>
          <input
            id="url"
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleChange}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default CreateBlog;
