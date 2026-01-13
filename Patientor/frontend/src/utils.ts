import { z } from "zod";
import { HealthCheckRating } from "./types";

const NewEntryBaseSchema = z.object({
  description: z.string().min(1, { message: "Description is missing" }),
  date: z.iso.date({ message: "missing entry date" }),
  specialist: z.string().min(1, { message: "Specialist is missing" }),
  diagnosisCodes: z.array(z.string()),
});

const HealthCheckEntrySchema = NewEntryBaseSchema.extend({
  type: z.literal("HealthCheck", { message: "Please select type for entry" }),
  healthCheckRating: z.enum(HealthCheckRating, {
    message: "Health rating not specified",
  }),
});

const HospitalEntrySchema = NewEntryBaseSchema.extend({
  type: z.literal("Hospital", { message: "Please select type for entry" }),
  discharge: z.object({
    date: z.iso.date({ message: "missing or invalid discharge date" }),
    criteria: z.string().min(1, { message: "Criteria is missing" }),
  }),
});

const OccupationalHealthcareEntry = NewEntryBaseSchema.extend({
  type: z.literal("OccupationalHealthcare", {
    message: "Please select type for entry",
  }),
  employerName: z.string().min(1, { message: "Employer's name is missing" }),
  sickLeave: z
    .object({
      startDate: z.iso.date({
        message: "missing or invalid start date format for sick leave",
      }),
      endDate: z.iso.date({
        message: "missing or invalid end date format for sick leave",
      }),
    })
    .optional(),
});

export const EntrySchema = z.discriminatedUnion("type", [
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntry,
]);
