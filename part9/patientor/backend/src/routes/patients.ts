import express from "express";
import patientService from "../services/patientService";
import {
  NewPatientEntry,
  NonSensitivePatientData,
  Patient
} from "../types/types";
import { toNewPatientEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  const patients: NonSensitivePatientData[] = patientService.getPatients();
  res.json(patients);
});

router.post("/", (req, res) => {
  try {
    const newPatient: NewPatientEntry = toNewPatientEntry(req.body);
    const addedPatient: Patient = patientService.createPatient(newPatient);
    res.json(addedPatient);
  } catch (e: unknown) {
    let errorMessage = "Something went wrong.";
    if (e instanceof Error) {
      errorMessage += " Error: " + e.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
