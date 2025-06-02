import { useState } from "react";
import PropTypes from "prop-types";
const Blog = ({ blog, handleLikes, user, handleRemove }) => {
  const [visible, setVisible] = useState(false);
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  return (
    <div style={blogStyle} className="blog">
      <div>
        <p className="blog__title">{blog.title}</p>
        <p className="blog__author">{blog.author}</p>
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div>
          <p className="blog__url">{blog.url}</p>
          <p className="blog__likes">likes {blog.likes}</p>
          <button onClick={() => handleLikes(blog.id, blog.likes)}>Like</button>
          <p>{blog.user.name}</p>
          {blog.user.username === user.username && (
            <button onClick={() => handleRemove(blog.id)}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  handleLikes: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired
};

export default Blog;
