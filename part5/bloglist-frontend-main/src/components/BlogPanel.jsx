import { useRef } from "react";
import CreateBlog from "./CreateBlog";
import Togglable from "./Togglable";
import { Link } from "react-router-dom";

const BlogPanel = ({ blogs }) => {
  const blogFormRef = useRef();
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <Togglable buttonLabel="Create new" ref={blogFormRef}>
        <CreateBlog blogFormRef={blogFormRef} />
      </Togglable>

      <BlogList blogs={blogs} />
    </div>
  );
};

const BlogList = ({ blogs }) => {
  return (
    <div className="mt-6 space-y-4">
      {blogs.map((blog) => (
        <p key={blog.id} className="text-lg">
          <Link
            to={`/blogs/${blog.id}`}
            className="text-blue-600 hover:underline"
          >
            {blog.title}
          </Link>
        </p>
      ))}
    </div>
  );
};

export default BlogPanel;
