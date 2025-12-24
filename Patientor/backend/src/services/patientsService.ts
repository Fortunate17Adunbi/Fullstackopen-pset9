import { v1 as uuid } from "uuid";
import { SafePatient, NewPatient } from "../types";
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

const savePatient = (entry: NewPatient): SafePatient => {
  const newPatient = {
    id: uuid(),
    ...entry,
  };
  patients.push(newPatient);
  return newPatient;
};

export default { getPatients, savePatient };
