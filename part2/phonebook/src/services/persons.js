import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl).then((res) => res.data);
};

const post = (newPerson) => {
  return axios.post(baseUrl, newPerson).then((res) => res.data);
};

const change = (id, changedPerson) => {
  return axios.put(`${baseUrl}/${id}`, changedPerson).then((res) => res.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((res) => res.data);
};

export default { getAll, post, change, remove };
