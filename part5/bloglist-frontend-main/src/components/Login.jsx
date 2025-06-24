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
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Log in to application
      </h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label
            htmlFor="username"
            className="block mb-1 font-medium text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-1 font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition"
        >
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <Link
          to="/createUser"
          className="inline-block text-blue-600 hover:underline"
        >
          Create New User
        </Link>
      </div>
    </div>
  );
};

export default Login;
