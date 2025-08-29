import axios from "axios";
import { apiBaseUrl } from "../constants";
import type { FlightDiaries } from "../types";

const getAll = async () => {
  const { data } = await axios.get<FlightDiaries[]>(`${apiBaseUrl}/diaries`);

  return data;
};

/* const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
}; */

export default {
  getAll
};
