import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import userService from "../services/users";
import { useNotificationDispatch } from "../context/NotificationContext";

const CreateUserPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatchNotification = useNotificationDispatch();

  const createUserMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      dispatchNotification({
        type: "SUCCESS_NOTIFICATION",
        text: "The user was created successfully!"
      });
      navigate("/");
      setTimeout(
        () => dispatchNotification({ type: "CLEAR_NOTIFICATION" }),
        5000
      );
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      dispatchNotification({
        type: "ERROR_NOTIFICATION",
        text: error.response.data.error
      });
      setTimeout(
        () => dispatchNotification({ type: "CLEAR_NOTIFICATION" }),
        5000
      );
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    createUserMutation.mutate({ name, username, password });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Create a new user
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            className="block mb-1 font-medium text-gray-700"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            className="block mb-1 font-medium text-gray-700"
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label
            className="block mb-1 font-medium text-gray-700"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={createUserMutation.isLoading}
          >
            {createUserMutation.isLoading ? "Creating..." : "Create user"}
          </button>
          <Link to="/">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreateUserPage;
