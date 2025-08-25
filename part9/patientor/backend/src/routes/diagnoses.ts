import express from "express";
import diagnoseService from "../services/diagnoseService";
import { Diagnose } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  const diagnoses: Diagnose[] = diagnoseService.getDiagnoses();
  res.json(diagnoses);
});

export default router;
