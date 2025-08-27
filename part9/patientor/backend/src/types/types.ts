import { newPatientEntrySchema } from "../utils";
import { z } from "zod";

export interface Diagnose {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  male = "male",
  female = "female",
  other = "other"
}

export type newPatientEntry = z.infer<typeof newPatientEntrySchema>;

export interface Patient extends newPatientEntry {
  id: string;
}

export type NonSensitivePatientData = Omit<Patient, "ssn">;
