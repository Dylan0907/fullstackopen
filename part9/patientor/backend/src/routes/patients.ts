import express from "express";
import patientService from "../services/patientService";
import { NonSensitivePatient, Patient } from "../types/types";
import { newPatientEntrySchema, toNewEntry } from "../utils";
import { z } from "zod";

const router = express.Router();

router.get("/", (_req, res) => {
  const patients: NonSensitivePatient[] = patientService.getPatients();
  res.json(patients);
});

router.get("/:id", (req, res) => {
  const patient = patientService.getPatientById(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404).send({ error: "No patient found with that ID" });
  }
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

router.post("/:id/entries", (req, res) => {
  try {
    const patientId = req.params.id;

    const newEntry = toNewEntry(req.body);

    const updatedPatient = patientService.addEntry(patientId, newEntry);
    res.json(updatedPatient);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    } else {
      res.status(400).send({ error: "Unknown error" });
    }
  }
});

export default router;
