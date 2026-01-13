import { v1 as uuid } from "uuid";
import { SafePatient, NewPatient, Patient, NewEntry } from "../types";
import patients from "../../data/patients";

const getPatients = (): SafePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const savePatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...entry,
  };
  patients.push(newPatient);
  return newPatient;
};

const findPatient = (id: string): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);

  return patient;
};

const addEntry = (id: string, entry: NewEntry): Patient | undefined => {
  console.log(`id in add entrt${id}`);
  const patient = patients.find((p) => p.id === id);
  console.log("patient ", patient, " entry ", entry);

  patient?.entries.push({
    ...entry,
    id: uuid(),
  });
  console.log("patinet after ", patient);
  return patient;
};

export default { getPatients, savePatient, findPatient, addEntry };
