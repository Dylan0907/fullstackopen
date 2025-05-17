import axios from "axios";
const URL = "http://localhost:3001/api/persons";

const getAll = () => {
  return axios.get(URL).then((res) => res.data);
};

const post = (newPerson) => {
  return axios.post(URL, newPerson).then((res) => res.data);
};

const change = (id, changedPerson) => {
  return axios.put(`${URL}/${id}`, changedPerson).then((res) => res.data);
};

const remove = (id) => {
  return axios.delete(`${URL}/${id}`).then((res) => res.data);
};

export default { getAll, post, change, remove };
