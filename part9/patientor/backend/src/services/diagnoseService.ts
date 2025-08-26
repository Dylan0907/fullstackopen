import diagnoses from "../data/diagnoses";
import { Diagnose } from "../types/types";

const getDiagnoses = (): Diagnose[] => {
  return diagnoses;
};

export default {
  getDiagnoses
};
