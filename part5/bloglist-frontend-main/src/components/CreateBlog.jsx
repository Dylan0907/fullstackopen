import { useState } from "react";
const CreateBlog = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({
    title: "",
    author: "",
    url: ""
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
    await addBlog(newBlog);
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
          title
          <input
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleChange}
          />
        </div>
        <div>
          author
          <input
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleChange}
          />
        </div>
        <div>
          url
          <input
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
