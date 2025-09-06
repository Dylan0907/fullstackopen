import patients from "../data/patients";
import { Entry, NewEntry, NonSensitivePatient, Patient } from "../types/types";
import { v1 as uuid } from "uuid";
const id = uuid();

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => {
    return { id, name, dateOfBirth, gender, occupation };
  });
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find((patient) => {
    return patient.id === id;
  });
};

const createPatient = (
  patientData: Omit<Patient, "id" | "entries">
): Patient => {
  const newPatient: Patient = {
    ...patientData,
    id: id,
    entries: []
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (id: string, entry: NewEntry): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  if (!patient) return undefined;

  const newEntry: Entry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);
  return patient;
};
export default {
  getPatients,
  createPatient,
  getPatientById,
  addEntry
};
