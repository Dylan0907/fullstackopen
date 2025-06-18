import { useState, useEffect, useRef } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Login from "./components/Login";
import Notification from "./components/Notification";
import BlogPanel from "./components/BlogPanel";
import { useNotificationDispatch } from "./context/NotificationContext";
import "./App.css";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();
  const dispatch = useNotificationDispatch();

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
      dispatch({
        type: "ERROR_NOTIFICATION",
        text: "Wrong username or password"
      });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
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
      setBlogs(blogs.concat(createdBlog));
      dispatch({
        text: `A new blog You're not going to need it! by ${user.name}`,
        type: "SUCCESS_NOTIFICATION"
      });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    } catch (exception) {
      dispatch({
        text: "Could not create a new blog",
        type: "ERROR_NOTIFICATION"
      });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  };

  return (
    <div>
      <Notification />
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
