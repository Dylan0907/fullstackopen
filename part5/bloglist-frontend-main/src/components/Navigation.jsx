import { Link, useNavigate } from "react-router-dom";
import { useUserDispatch } from "../context/UserContext";
import blogService from "../services/blogs";

const Navigation = ({ user }) => {
  const dispatchUser = useUserDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatchUser({ type: "LOGOUT_USER" });
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogappUser");
    navigate("/");
  };

  return (
    <nav className="bg-gray-100 px-4 py-3 shadow-sm">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 text-sm font-medium"
          >
            blogs
          </Link>
          <Link
            to="/users"
            className="text-gray-700 hover:text-blue-600 text-sm font-medium"
          >
            users
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">{user.name} logged in</span>
          <button
            onClick={handleLogout}
            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
