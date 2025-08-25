import express from "express";
import patientService from "../services/patientService";
import { NonSensitivePatientData } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  const patients: NonSensitivePatientData[] = patientService.getPatients();
  res.json(patients);
});

export default router;
