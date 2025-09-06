import diagnoses from "../data/diagnoses";
import { Diagnosis } from "../types/types";

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const getByCodes = (diagnosisCodes: string[]): Diagnosis[] => {
  const selectedDiagnoses: Diagnosis[] = diagnoses.filter((diagnose) => {
    return diagnosisCodes.includes(diagnose.code);
  });
  return selectedDiagnoses;
};

export default {
  getDiagnoses,
  getByCodes
};
