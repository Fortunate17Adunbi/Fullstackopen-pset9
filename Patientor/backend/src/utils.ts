import { z } from "zod";
import { Gender, NewEntry, Diagnosis, HealthCheckRating } from "./types";

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.iso.date(),
  ssn: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
});

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};
export const NewEntrySchema = z.object({
  description: z.string(),
  date: z.iso.date(),
  specialist: z.string(),
});
const DischargeSchema = z.object({
  criteria: z.string(),
  date: z.iso.date(),
});
const OccupationalSchema = z.object({
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.iso.date(),
      endDate: z.iso.date(),
    })
    .optional(),
});

// const assertNever = (value: never): never => {
//   throw new Error(`Unhandled dicriminate union memeber${JSON.stringify(value)}`)
// }
export const parseEntryReq = (obj: unknown): NewEntry => {
  if (!obj || typeof obj !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if ("type" in obj) {
    const returnValue: z.infer<typeof NewEntrySchema> =
      NewEntrySchema.parse(obj);

    switch (obj.type) {
      case "Hospital":
        if ("discharge" in obj) {
          console.log(obj);
          console.log("returned ", returnValue);
          const hospitalEntry: NewEntry = {
            ...returnValue,
            diagnosisCodes: parseDiagnosisCodes(obj),
            type: "Hospital",
            discharge: DischargeSchema.parse(obj.discharge),
          };
          console.log("hostipal entry ", hospitalEntry);
          return hospitalEntry;
        } else {
          throw new Error("Discharge input missing");
        }

      case "OccupationalHealthcare":
        const occupational = OccupationalSchema.parse(obj);
        return {
          ...returnValue,
          type: "OccupationalHealthcare",
          diagnosisCodes: parseDiagnosisCodes(obj),
          ...occupational,
        };

      case "HealthCheck":
        if ("healthCheckRating" in obj) {
          return {
            ...returnValue,
            type: "HealthCheck",
            diagnosisCodes: parseDiagnosisCodes(obj),
            healthCheckRating: z
              .enum(HealthCheckRating)
              .parse(obj.healthCheckRating),
          };
        } else {
          throw new Error("Invalind or missing healthCheckRating");
        }

      default:
        // return assertNever
        throw new Error("The type does not exist");
    }
  } else {
    throw new Error('missing input details: require "type"');
  }
};
