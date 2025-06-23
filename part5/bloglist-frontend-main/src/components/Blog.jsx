import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";
import { useNotificationDispatch } from "../context/NotificationContext";

const Blog = ({ handleLikes, blogs, handleRemove, user }) => {
  const { id } = useParams();

  const blog = blogs.find((blog) => blog.id === id);

  return (
    <div className="bg-white max-w-3xl mx-auto p-6 shadow-md rounded space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">{blog.title}</h2>
      <p className="text-gray-600">by {blog.author}</p>

      <a
        className="text-blue-600 hover:underline break-words"
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {blog.url}
      </a>

      <div className="flex items-center space-x-4">
        <p className="text-gray-700">Likes: {blog.likes}</p>
        <button
          onClick={() =>
            handleLikes({ blogId: blog.id, likes: blog.likes + 1 })
          }
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
        >
          Like
        </button>
      </div>

      {blog.user.username === user.username && (
        <button
          onClick={() => handleRemove({ id: blog.id })}
          className="text-red-600 hover:underline text-sm"
        >
          Remove
        </button>
      )}

      <div className="pt-4">
        <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
        <CommentForm blogId={blog.id} />
        <ul className="mt-4 space-y-2 list-disc list-inside text-gray-700">
          {blog.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const CommentForm = ({ blogId }) => {
  const [comment, setComment] = useState("");
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation({
    mutationFn: blogService.addComment,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => (updatedBlog.id === blog.id ? updatedBlog : blog))
      );
      dispatch({ type: "SUCCESS_NOTIFICATION", text: "Comment created!" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    },
    onError: (e) => {
      dispatch({ type: "ERROR_NOTIFICATION", text: "Could not add comment" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() === "") return;
    addCommentMutation.mutate({ blogId, comment });
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3 w-1/3">
      <label
        htmlFor="comment"
        className="block text-sm font-medium text-gray-700"
      >
        Add a comment:
      </label>
      <input
        type="text"
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Write your comment..."
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded"
      >
        Submit
      </button>
    </form>
  );
};

Blog.propTypes = {
  handleLikes: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired
};

export default Blog;
