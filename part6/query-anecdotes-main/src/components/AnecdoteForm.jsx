import { createAnecdote } from "../utils/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNotificationDispatch } from "../context/NotificationContext";

const getId = () => (100000 * Math.random()).toFixed(0);

const AnecdoteForm = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();

  //mutation for creating a new anecdote, after a successful request, it adds the new one to the list without a new get request
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
      dispatch({ type: "CREATE_NOTIFICATION" });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    },
    onError: (e) => {
      dispatch({ type: "ERROR_NOTIFICATION", error: e.response.data.error });
      setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
    }
  });

  const onCreate = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    newAnecdoteMutation.mutate({ content, votes: 0, id: getId() });
    event.target.anecdote.value = "";
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
