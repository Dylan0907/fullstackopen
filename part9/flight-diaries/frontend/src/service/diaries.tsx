import axios from "axios";
import { apiBaseUrl } from "../constants";
import type { FlightDiary, DiaryFormData } from "../types";

const getAll = async () => {
  const { data } = await axios.get<FlightDiary[]>(`${apiBaseUrl}/diaries`);

  return data;
};

const create = async (object: DiaryFormData) => {
  const { data } = await axios.post<FlightDiary>(
    `${apiBaseUrl}/diaries`,
    object
  );

  return data;
};

export default {
  getAll,
  create
};
