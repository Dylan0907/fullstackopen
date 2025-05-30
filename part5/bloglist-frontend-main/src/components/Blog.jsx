import { useState } from "react";

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
    <div style={blogStyle}>
      <div>
        <p>
          {blog.title} {blog.author}
        </p>
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes}</p>
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

export default Blog;
