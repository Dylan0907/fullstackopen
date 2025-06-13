import { createAnecdote } from "../utils/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const getId = () => (100000 * Math.random()).toFixed(0);
const AnecdoteForm = () => {
  const queryClient = useQueryClient();

  //mutation for creating a new anecdote, after a successful request, it adds the new one to the list without a new get request
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
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
