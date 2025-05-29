import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Login from "./components/Login";
import Notification from "./components/Notification";
import CreateBlog from "./components/CreateBlog";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password
      });
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessage({ text: "Wrong username or password", color: "red" });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.clear();
  };

  const addBlog = async (newBlog) => {
    try {
      const createdBog = await blogService.create(newBlog);
      setMessage({
        text: `A new blog You're not going to need it! by ${user.name}`,
        color: "green"
      });
      setBlogs(blogs.concat(createdBog));
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setMessage({ text: "Could not create a new blog", color: "red" });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  return (
    <div>
      <Notification message={message} />
      {user ? (
        <>
          <h1>Blogs</h1>
          <p>{`${user.name} logged in`}</p>
          <button onClick={() => handleLogout()}>logout</button>
          <CreateBlog addBlog={addBlog} />
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </>
      ) : (
        <>
          <Login
            username={username}
            setUsername={setUsername}
            handleLogin={handleLogin}
            password={password}
            setPassword={setPassword}
          />
        </>
      )}
    </div>
  );
};

export default App;
