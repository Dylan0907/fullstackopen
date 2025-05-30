import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Login from "./components/Login";
import Notification from "./components/Notification";
import BlogPanel from "./components/BlogPanel";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) =>
        blogs.sort((a, b) => {
          return b.likes - a.likes;
        })
      )
      .then((sortedBlogs) => setBlogs(sortedBlogs));
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
      const createdBlog = await blogService.create(newBlog);
      blogFormRef.current.toggleVisibility();
      setMessage({
        text: `A new blog You're not going to need it! by ${user.name}`,
        color: "green"
      });
      setBlogs(blogs.concat(createdBlog));
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
        <BlogPanel
          blogs={blogs}
          user={user}
          addBlog={addBlog}
          handleLogout={handleLogout}
          blogFormRef={blogFormRef}
          setBlogs={setBlogs}
        />
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
