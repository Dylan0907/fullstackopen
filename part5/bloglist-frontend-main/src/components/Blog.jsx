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
    <div className="blog">
      <h2 className="blog__title">{blog.title}</h2>
      <p className="blog__author">{blog.author}</p>
      <a className="blog__url" href={blog.url}>
        {blog.url}
      </a>
      <div>
        <p className="blog__likes">likes {blog.likes}</p>
        <button
          onClick={() =>
            handleLikes({ blogId: blog.id, likes: blog.likes + 1 })
          }
        >
          Like
        </button>
      </div>
      {blog.user.username === user.username && (
        <button onClick={() => handleRemove({ id: blog.id })}>remove</button>
      )}
      <div>
        <h3>Comments</h3>
        <CommentForm blogId={id} />
        <ul>
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
    <form onSubmit={handleSubmit}>
      <label htmlFor="comment">Add a comment:</label>
      <br />
      <input
        type="text"
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
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
