import patients from "../data/patients";
import { NonSensitivePatientData, Patient } from "../types/types";
import { v1 as uuid } from "uuid";
const id = uuid();

const getPatients = (): NonSensitivePatientData[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => {
    return { id, name, dateOfBirth, gender, occupation };
  });
};
const createPatient = (patientData: Omit<Patient, "id">): Patient => {
  const newPatient: Patient = {
    ...patientData,
    id: id
  };
  patients.push(newPatient);
  return newPatient;
};
export default {
  getPatients,
  createPatient
};
