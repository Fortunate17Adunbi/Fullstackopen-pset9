import { z } from "zod";
import { NewPatientSchema } from "./utils";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string | undefined;
}
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn?: string | undefined;
  gender: Gender;
  occupation: string;
}

export type SafePatient = Omit<Patient, "ssn">;
export type NewPatient = z.infer<typeof NewPatientSchema>;
