import { useState, useEffect } from "react";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Login from "./components/Login";
import Notification from "./components/Notification";
import BlogPanel from "./components/BlogPanel";
import { useNotificationDispatch } from "./context/NotificationContext";
import { useUserDispatch, useUserValue } from "./context/UserContext";
import { useQuery } from "@tanstack/react-query";
import "./App.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatchNotification = useNotificationDispatch();
  const dispatchUser = useUserDispatch();
  const user = useUserValue();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false
  });
  console.log(JSON.parse(JSON.stringify(result)));

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

  const handleLogout = () => {
    dispatchUser({ type: "LOGOUT_USER" });
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };

  if (result.isLoading) {
    return <div>Loading...</div>;
  }

  if (result.isError) {
    return <div>Blogs service not available due to problems in server</div>;
  }

  const blogs = result.data.sort((a, b) => {
    return b.likes - a.likes;
  });

  return (
    <div>
      <Notification />
      {user ? (
        <BlogPanel
          blogs={blogs}
          user={user}
          handleLogout={handleLogout}

          /* setBlogs={setBlogs} */
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
