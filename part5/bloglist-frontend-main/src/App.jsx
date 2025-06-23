import blogService from "./services/blogs";
import Login from "./components/Login";
import Notification from "./components/Notification";
import CreateUserPage from "./components/CreateUserPage";
import Dashboard from "./components/Dashboard";
import { useUserValue } from "./context/UserContext";
import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { Route, Routes } from "react-router-dom";
const App = () => {
  const user = useUserValue();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    retry: 1,
    refetchOnWindowFocus: false
  });
  console.log(JSON.parse(JSON.stringify(result)));

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
        <Dashboard blogs={blogs} user={user} />
      ) : (
        <>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/createUser" element={<CreateUserPage />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
