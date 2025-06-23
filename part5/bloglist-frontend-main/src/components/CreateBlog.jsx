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
      queryClient.invalidateQueries(["users"]);
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
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Create new</h2>
      <form onSubmit={handleNewBlog} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block mb-1 font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={newBlog.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="author"
            className="block mb-1 font-medium text-gray-700"
          >
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={newBlog.author}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="url" className="block mb-1 font-medium text-gray-700">
            URL
          </label>
          <input
            id="url"
            name="url"
            type="text"
            value={newBlog.url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          disabled={newBlogMutation.isLoading}
        >
          {newBlogMutation.isLoading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
