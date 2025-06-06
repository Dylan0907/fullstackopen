import { voteAnecdote } from "../reducers/anecdoteReducer";
import {
  setNotification,
  clearNotification
} from "../reducers/noficationReducer";
import { useSelector, useDispatch } from "react-redux";

const AnecdoteList = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter) {
      return anecdotes.filter((anecdote) => anecdote.content.includes(filter));
    }
    return anecdotes;
  });

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);

  const vote = (id, content) => {
    dispatch(voteAnecdote(id));
    dispatch(setNotification(`you voted '${content}'`));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  return (
    <>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
