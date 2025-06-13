import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { useNotificationDispatch } from "./context/NotificationContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnecdotes, updateAnecdote } from "./utils/requests";

const App = () => {
  const queryClient = useQueryClient();
  const dispatch = useNotificationDispatch();
  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false
  });

  //mutation for updating the number of votes, after a successful request, it modifies all the anecdotes with the new vote value
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
        )
      );
    }
  });
  console.log(JSON.parse(JSON.stringify(result)));

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    dispatch({ type: "VOTE_NOTIFICATION", anecdote: anecdote.content });
    setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 5000);
  };

  if (result.isLoading) {
    return <div>Loading...</div>;
  }

  if (result.isError) {
    return <div>Anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
