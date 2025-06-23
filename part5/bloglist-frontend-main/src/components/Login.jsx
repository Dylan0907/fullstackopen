import { useState } from "react";
import { Link } from "react-router-dom";
import loginService from "../services/login";
import { useNotificationDispatch } from "../context/NotificationContext";
import { useUserDispatch } from "../context/UserContext";
import blogService from "../services/blogs";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatchNotification = useNotificationDispatch();
  const dispatchUser = useUserDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password
      });
      blogService.setToken(user.token);
      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      dispatchUser({ type: "SET_USER", user });
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatchNotification({
        type: "ERROR_NOTIFICATION",
        text: "Wrong username or password"
      });
      setTimeout(
        () => dispatchNotification({ type: "CLEAR_NOTIFICATION" }),
        5000
      );
    }
  };
  return (
    <>
      <h1>log in to application</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">username</label>
          <input
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password</label>
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      <Link to="/createUser">
        <button>Create New User</button>
      </Link>
    </>
  );
};

export default Login;
