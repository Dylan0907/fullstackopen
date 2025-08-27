import express from "express";
import patientService from "../services/patientService";
import { NonSensitivePatientData, Patient } from "../types/types";
import { newPatientEntrySchema } from "../utils";
import { z } from "zod";

const router = express.Router();

router.get("/", (_req, res) => {
  const patients: NonSensitivePatientData[] = patientService.getPatients();
  res.json(patients);
});

router.post("/", (req, res) => {
  try {
    const newPatient = newPatientEntrySchema.parse(req.body);
    const addedPatient: Patient = patientService.createPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: "unknown error" });
    }
  }
});

export default router;
