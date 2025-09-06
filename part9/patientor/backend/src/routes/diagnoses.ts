import express from "express";
import diagnoseService from "../services/diagnoseService";
import { Diagnosis } from "../types/types";

const router = express.Router();

router.get("/", (_req, res) => {
  const diagnoses: Diagnosis[] = diagnoseService.getDiagnoses();
  res.json(diagnoses);
});

router.get("/codes", (req, res) => {
  const codes = req.query["codes[]"];

  let codesArray: string[];

  if (typeof codes === "string") {
    codesArray = [codes];
  } else if (Array.isArray(codes)) {
    codesArray = codes as string[];
  } else {
    return res.status(400).json({ error: "codes missing" });
  }

  const diagnoses: Diagnosis[] = diagnoseService.getByCodes(codesArray);

  return res.status(200).json(diagnoses);
});

export default router;
