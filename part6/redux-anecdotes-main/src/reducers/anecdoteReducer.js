import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const AnecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      return state.map((anecdote) => {
        const id = action.payload.id;
        if (anecdote.id === id) return action.payload;
        return anecdote;
      });
    },
    addAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    }
  }
});

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};
export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(addAnecdote(newAnecdote));
  };
};

export const addVote = (anecdote) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.vote(anecdote);
    dispatch(voteAnecdote(updatedAnecdote));
  };
};

export const { voteAnecdote, addAnecdote, setAnecdotes } =
  AnecdoteSlice.actions;
export default AnecdoteSlice.reducer;
