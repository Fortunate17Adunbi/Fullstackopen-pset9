import { z } from "zod";
import { NewPatientSchema } from "./utils";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}
export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string | undefined;
}

interface Leave {
  startDate: string;
  endDate: string;
}
interface Discharge {
  date: string;
  criteria: string;
}
interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}
interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: Leave | undefined;
}
interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge: Discharge;
}

export type Entry =
  | HealthCheckEntry
  | OccupationalHealthcareEntry
  | HospitalEntry;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn?: string | undefined;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

type UnionOmit<T, k extends string | number | symbol> = T extends unknown
  ? Omit<T, k>
  : never;

export type SafePatient = Omit<Patient, "ssn" | "entries">;
export type NewPatient = z.infer<typeof NewPatientSchema>;
export type NewEntry = UnionOmit<Entry, "id">;
