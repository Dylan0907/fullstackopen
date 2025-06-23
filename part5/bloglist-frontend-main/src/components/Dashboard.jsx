import Blog from "./Blog";
import BlogPanel from "./BlogPanel";
import blogService from "../services/blogs";
import userService from "../services/users";
import IndividualUserView from "./IndividualUserView";
import { useNotificationDispatch } from "../context/NotificationContext";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import UsersView from "./UsersView";
import { Routes, Route, useNavigate, Link } from "react-router-dom";

const Dashboard = ({ blogs, user }) => {
  const dispatch = useNotificationDispatch();
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    retry: 1,
    refetchOnWindowFocus: false
  });

  const voteBlogMutation = useMutation({
    mutationFn: blogService.addLike,
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(["blogs"]);
      queryClient.setQueryData(
        ["blogs"],
        blogs.map((blog) => (updatedBlog.id === blog.id ? updatedBlog : blog))
      );
      dispatch({ type: "SUCCESS_NOTIFICATION", text: "blog voted!" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    },
    onError: (e) => {
      dispatch({ type: "ERROR_NOTIFICATION", text: "Could not vote blog" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
      dispatch({
        text: `The blog was deleted successfully!`,
        type: "SUCCESS_NOTIFICATION"
      });
      navigate("/");
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    },
    onError: (e) => {
      console.log(e);

      dispatch({ type: "ERROR_NOTIFICATION", text: "Could not remove blog" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  });

  if (result.isLoading) {
    return <div>Loading...</div>;
  }

  if (result.isError) {
    return <div>User service not available due to problems in server</div>;
  }
  const users = result.data.sort((a, b) => {
    return b.blogs.length - a.blogs.length;
  });

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-3 text-center">
        Blogs
      </h1>

      <Routes>
        <Route path="/users" element={<UsersView users={users} />} />
        <Route
          path="/users/:id"
          element={<IndividualUserView users={users} />}
        />
        <Route path="/" element={<BlogPanel blogs={blogs} />} />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blogs={blogs}
              handleRemove={deleteBlogMutation.mutate}
              handleLikes={voteBlogMutation.mutate}
              user={user}
            />
          }
        />
      </Routes>
    </>
  );
};

export default Dashboard;
