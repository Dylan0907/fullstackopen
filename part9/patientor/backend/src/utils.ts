import { Gender, NewEntry } from "./types/types";
import { z } from "zod";

export const newPatientEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string()
});

const isString = (text: unknown): text is string =>
  typeof text === "string" || text instanceof String;

const isDate = (date: string): boolean => Boolean(Date.parse(date));

const isHealthCheckRating = (param: unknown): param is 0 | 1 | 2 | 3 =>
  typeof param === "number" && [0, 1, 2, 3].includes(param);

export const toNewEntry = (object: any): NewEntry => {
  if (!object || !object.type || !isString(object.type)) {
    throw new Error("Missing or invalid type");
  }

  const baseFields = {
    date: parseDate(object.date),
    specialist: parseString(object.specialist, "specialist"),
    description: parseString(object.description, "description"),
    diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes)
  };

  switch (object.type) {
    case "HealthCheck":
      return {
        ...baseFields,
        type: "HealthCheck",
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
      };

    case "Hospital":
      return {
        ...baseFields,
        type: "Hospital",
        discharge: {
          date: parseDate(object.discharge?.date),
          criteria: parseString(
            object.discharge?.criteria,
            "discharge.criteria"
          )
        }
      };

    case "OccupationalHealthcare":
      return {
        ...baseFields,
        type: "OccupationalHealthcare",
        employerName: parseString(object.employerName, "employerName"),
        sickLeave: object.sickLeave
          ? {
              startDate: parseDate(object.sickLeave.startDate),
              endDate: parseDate(object.sickLeave.endDate)
            }
          : undefined
      };

    default:
      throw new Error(`Unknown entry type: ${object.type}`);
  }
};

// ----------------------- helpers -----------------------
const parseString = (value: unknown, field: string): string => {
  if (!value || !isString(value)) {
    throw new Error(`Invalid or missing ${field}`);
  }
  return value;
};

const parseDate = (value: unknown): string => {
  if (!value || !isString(value) || !isDate(value)) {
    throw new Error(`Invalid or missing date: ${value}`);
  }
  return value;
};

const parseDiagnosisCodes = (codes: unknown): string[] | undefined => {
  if (!codes) return undefined;
  if (!Array.isArray(codes) || !codes.every((c) => isString(c))) {
    throw new Error("Invalid diagnosis codes");
  }
  return codes as string[];
};

const parseHealthCheckRating = (rating: unknown): 0 | 1 | 2 | 3 => {
  if (!isHealthCheckRating(rating)) {
    throw new Error("Invalid or missing healthCheckRating");
  }
  return rating;
};
