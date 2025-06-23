import { Link } from "react-router-dom";
import { useUserDispatch } from "../context/UserContext";
import blogService from "../services/blogs";

const Navigation = ({ user }) => {
  const dispatchUser = useUserDispatch();

  const handleLogout = () => {
    dispatchUser({ type: "LOGOUT_USER" });
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogappUser");
  };
  return (
    <nav>
      <Link to="/">
        <p>blogs</p>
      </Link>
      <Link to="/users">
        <p>users</p>
      </Link>
      <p>{`${user.name} logged in`}</p>
      <Link to="/">
        <button onClick={() => handleLogout()}>logout</button>
      </Link>
    </nav>
  );
};

export default Navigation;
