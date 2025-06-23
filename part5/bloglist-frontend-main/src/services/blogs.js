import axios from "axios";
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token }
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const addLike = async ({ blogId, likes }) => {
  const response = await axios.put(`${baseUrl}/${blogId}`, { likes });
  return response.data;
};

const addComment = async ({ blogId, comment }) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, {
    comment
  });
  return response.data;
};

const remove = async ({ id }) => {
  const config = {
    headers: { Authorization: token }
  };
  await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, addLike, addComment, create, setToken, remove };
