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
    },
    onError: (error) => {
      console.error("Error creating user:", error);
      dispatchNotification({
        type: "ERROR_NOTIFICATION",
        text: error.response.data.error
      });
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    createUserMutation.mutate({ name, username, password });
  };

  return (
    <div>
      <h1>Create a new user</h1>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          username:{" "}
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          password:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Create user</button>
      </form>
      <Link to="/">
        <button>Cancel</button>
      </Link>
    </div>
  );
};

export default CreateUserPage;
