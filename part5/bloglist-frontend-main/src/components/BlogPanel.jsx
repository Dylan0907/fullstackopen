import { useRef } from "react";
import CreateBlog from "./CreateBlog";
import Togglable from "./Togglable";
import { Link } from "react-router-dom";

const BlogPanel = ({ blogs }) => {
  const blogFormRef = useRef();
  return (
    <div>
      <Togglable buttonLabel={"New Blog"} ref={blogFormRef}>
        <CreateBlog blogFormRef={blogFormRef} />
      </Togglable>
      <BlogList blogs={blogs} />
    </div>
  );
};

const BlogList = ({ blogs }) => {
  return (
    <>
      {blogs.map((blog) => (
        <p key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </p>
      ))}
    </>
  );
};

export default BlogPanel;
