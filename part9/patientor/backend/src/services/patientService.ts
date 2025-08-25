import patients from "../data/patients";
import { NonSensitivePatientData } from "../types";

const getPatients = (): NonSensitivePatientData[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => {
    return { id, name, dateOfBirth, gender, occupation };
  });
};

export default {
  getPatients
};
