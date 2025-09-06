import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Diagnose } from "../types";

const getByCodes = async (codes: string[] | undefined) => {
  const { data } = await axios.get<Diagnose[]>(
    `${apiBaseUrl}/diagnoses/codes`,
    {
      params: { codes }
    }
  );
  return data;
};

export default { getByCodes };
