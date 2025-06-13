import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAnecdotes = () => axios.get(baseUrl).then((res) => res.data);

const createAnecdote = (newAnecdote) =>
  axios.post(baseUrl, newAnecdote).then((res) => res.data);

const updateAnecdote = (updatedAnecdote) =>
  axios
    .put(`${baseUrl}/${updatedAnecdote.id}`, updatedAnecdote)
    .then((res) => res.data);

export { getAnecdotes, createAnecdote, updateAnecdote };
