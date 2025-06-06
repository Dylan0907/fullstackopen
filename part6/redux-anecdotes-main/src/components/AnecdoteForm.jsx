import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import {
  setNotification,
  clearNotification
} from "../reducers/noficationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addNewAnecdote = (e) => {
    e.preventDefault();
    dispatch(createAnecdote(e.target.newAnecdote.value));
    dispatch(setNotification(`you created a new anecdote!`));
    e.target.newAnecdote.value = "";
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addNewAnecdote}>
        <div>
          <input name="newAnecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default AnecdoteForm;
