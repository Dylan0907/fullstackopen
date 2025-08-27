import { Gender } from "./types/types";
import { z } from "zod";

export const newPatientEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string()
});
