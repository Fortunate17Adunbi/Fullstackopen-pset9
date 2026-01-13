import { useEffect, useState } from "react";
import axios from "axios";
import { default as SelectA, SingleValue } from "react-select";
import { TextField, Button, FormLabel } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { Diagnosis, Patient, HealthCheckRating } from "../types";
import { EntrySchema } from "../utils";
import diagnosesService from "../services/diagnoses";
import patientService from "../services/patients";
import HealthCheckEntryDetails from "./Entries/HealthCheckEntryDetails";
import HospitalEntryDetails from "./Entries/HospitalEntryDetails";
import OccupationalHealthcareEntryDetails from "./Entries/OccupationalHealthcareEntryDetails";
import Notification from "./Notification";
import React from "react";

interface Props {
  patient: Patient | undefined;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}
interface OptionType {
  value: string;
  label: string;
}

interface ObjectType {
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes: Array<Diagnosis["code"]>;
  type: string | undefined;
  healthCheckRating: HealthCheckRating;
  employerName: string;
  sickLeave:
    | {
        startDate: string;
        endDate: string;
      }
    | undefined;
  discharge: {
    date: string;
    criteria: string;
  };
}

const PatientDetails = ({ patient, setPatient }: Props) => {
  const obj = {
    error: "",
    success: "",
  };

  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [type, setType] = useState<OptionType | null>({
    label: "",
    value: "",
  });
  const baseEntry: ObjectType = {
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    type: type?.value,
    healthCheckRating: 0,
    employerName: "",
    sickLeave: {
      startDate: "",
      endDate: "",
    },
    discharge: {
      date: "",
      criteria: "",
    },
  };

  const [entryForm, setEntryForm] = useState(baseEntry);
  const [message, setMessage] = useState(obj);
  const [showCancel, setShowCancel] = useState<Boolean>(false);

  useEffect(() => {
    diagnosesService.getDiagnoses().then((response) => {
      setDiagnoses(response);
    });
  }, []);
  useEffect(() => {
    setEntryForm({ ...entryForm, type: type?.value || "" });
  }, [type]);
  const handleChange = (
    event: SelectChangeEvent<typeof entryForm.diagnosisCodes>
  ) => {
    const {
      target: { value },
    } = event;
    setEntryForm({
      ...entryForm,
      diagnosisCodes: typeof value === "string" ? value.split(",") : value,
    });
  };
  const codes = ["S62.5", "Z57.1", "Z74.3", "M51.2"];
  // console.log("entryForm ", entryForm);
  if (!patient) {
    return (
      <div>
        <h3>Error: Patient not found</h3>
      </div>
    );
  }
  const assertNever = (value: never): never => {
    throw new Error(`Unhandled entry in union: ${JSON.stringify(value)}`);
  };
  const getDiagnosis = (code: string): string => {
    const diagnosis = diagnoses.find((diagnosis) => diagnosis.code === code);
    if (!diagnosis) {
      return "no data found";
    } else {
      return diagnosis.name;
    }
  };

  const setOption = (option: SingleValue<OptionType>) => {
    setType(option);
  };
  const options = [
    { value: "HealthCheck", label: "HealthCheck" },
    { value: "OccupationalHealthcare", label: "OccupationalHealthcare" },
    { value: "Hospital", label: "Hospital" },
  ];
  console.log("type ", type);
  console.log("entryForm ", entryForm);
  const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
    if (
      !object ||
      typeof object !== "object" ||
      !("diagnosisCodes" in object)
    ) {
      // we will just trust the data to be in correct form
      return [] as Array<Diagnosis["code"]>;
    }

    return object.diagnosisCodes as Array<Diagnosis["code"]>;
  };

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const cleansedEntry = {
        ...entryForm,
        sickLeave:
          entryForm.sickLeave?.endDate || entryForm.sickLeave?.startDate
            ? entryForm.sickLeave
            : undefined,
      };
      console.log("this is the entry from ", cleansedEntry);
      const result = EntrySchema.safeParse(cleansedEntry);
      // let errorMessage: string = "invalid or missing value for field ";
      if (!result.success) {
        console.log("zod erro ", result.error);
        console.log("zod erro down ", result.error.issues[0].message);
        // console.log("zod erro patt ", result.error);
        // result.error.issues.forEach((obj) => {
        //   console.log(" obj, ", ...obj.path);
        //   errorMessage += `, ${obj.path.join(", ")}`;
        // });
        // console.log(errorMessage, "error message");
        setMessage({
          ...message,
          error: result.error.issues[0]?.message || "unknown error",
        });
        setTimeout(() => {
          setMessage(obj);
        }, 5000);
      } else {
        console.log("PARSED ", result.data);
        patientService
          .createEntry(patient.id, {
            ...result.data,
            diagnosisCodes: parseDiagnosisCodes(result.data),
          })
          .then((patient) => {
            setPatient(patient);
            setMessage({
              ...message,
              success: `added entry for patinet ${patient.name}`,
            });
            setTimeout(() => {
              setMessage(obj);
            }, 5000);
            setEntryForm(baseEntry);
          });
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data);
        setTimeout(() => {
          setMessage(obj);
        }, 5000);
      }
    }
  };
  console.log(getDiagnosis("wewe"));
  const genderToShow =
    patient.gender === "male" ? <MaleIcon /> : <FemaleIcon />;

  const style = {
    border: "1px dotted",
    padding: "10px",
  };
  const displayPattern = { display: showCancel ? "" : "none" };
  return (
    <div>
      <h2>
        {patient.name} {genderToShow}
      </h2>
      <p>
        ssn: {patient.ssn}
        <br />
        occupation: {patient.occupation}
      </p>

      <Notification error={message.error} success={message.success} />
      <form onSubmit={addEntry}>
        <div style={style}>
          <div>
            <h3>New {type?.label || ""} entry</h3>
          </div>
          <div style={displayPattern}>
            <TextField
              label="Description"
              variant="standard"
              fullWidth
              value={entryForm.description}
              onChange={({ target }) =>
                setEntryForm({ ...entryForm, description: target.value })
              }
            />
            <TextField
              label="Date"
              InputLabelProps={{ shrink: true }}
              variant="standard"
              fullWidth
              type="date"
              value={entryForm.date}
              onChange={({ target }) =>
                setEntryForm({ ...entryForm, date: target.value })
              }
            />
            <TextField
              label="Specialist"
              variant="standard"
              fullWidth
              value={entryForm.specialist}
              onChange={({ target }) =>
                setEntryForm({ ...entryForm, specialist: target.value })
              }
            />

            {type?.value === "HealthCheck" && (
              <>
                <FormLabel>HealthCheck rating</FormLabel>
                <div>
                  <FormLabel style={{ fontSize: "13px" }}>Healthy</FormLabel>
                  <input
                    type="radio"
                    name="rating"
                    value={entryForm.healthCheckRating}
                    onChange={() =>
                      setEntryForm({
                        ...entryForm,
                        healthCheckRating: HealthCheckRating["Healthy"],
                      })
                    }
                  />
                  <FormLabel style={{ fontSize: "13px" }}>LowRisk</FormLabel>
                  <input
                    type="radio"
                    name="rating"
                    value={entryForm.healthCheckRating}
                    onChange={() =>
                      setEntryForm({
                        ...entryForm,
                        healthCheckRating: HealthCheckRating["LowRisk"],
                      })
                    }
                  />
                  <FormLabel style={{ fontSize: "13px" }}>HighRisk</FormLabel>
                  <input
                    type="radio"
                    name="rating"
                    value={entryForm.healthCheckRating}
                    onChange={() =>
                      setEntryForm({
                        ...entryForm,
                        healthCheckRating: HealthCheckRating["HighRisk"],
                      })
                    }
                  />
                  <FormLabel style={{ fontSize: "13px" }}>
                    CriticalRisk
                  </FormLabel>
                  <input
                    type="radio"
                    name="rating"
                    value={entryForm.healthCheckRating}
                    onChange={() =>
                      setEntryForm({
                        ...entryForm,
                        healthCheckRating: HealthCheckRating["CriticalRisk"],
                      })
                    }
                  />
                </div>
              </>
            )}

            <InputLabel id="demo-multiple-checkbox-label">
              Diagnosis code
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              fullWidth
              value={entryForm.diagnosisCodes}
              onChange={handleChange}
              input={<OutlinedInput label="Diagnosis code" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {codes.map((code) => (
                <MenuItem key={code} value={code}>
                  <Checkbox checked={entryForm.diagnosisCodes.includes(code)} />
                  <ListItemText primary={code} />
                </MenuItem>
              ))}
            </Select>
            {/* <TextField
              label="Diagnosis code"
              variant="standard"
              fullWidth
              value={dCode}
              onChange={({ target }) => setDCode(target.value)}
            /> */}

            {type?.value === "OccupationalHealthcare" && (
              <div>
                <TextField
                  label="Employer Name"
                  variant="standard"
                  value={entryForm.employerName}
                  onChange={({ target }) => {
                    setEntryForm({ ...entryForm, employerName: target.value });
                  }}
                  fullWidth
                />
                <div style={{ paddingTop: "10px" }}>
                  <FormLabel>Sick Leave</FormLabel>
                  <div style={{ padding: "10px" }}>
                    <TextField
                      label="start"
                      InputLabelProps={{ shrink: true }}
                      type="date"
                      variant="standard"
                      value={entryForm.sickLeave?.startDate}
                      onChange={({ target }) =>
                        setEntryForm({
                          ...entryForm,
                          sickLeave: {
                            ...entryForm.sickLeave,
                            startDate: target.value,
                            endDate: entryForm.sickLeave?.endDate || "",
                          },
                        })
                      }
                      fullWidth
                    />

                    <TextField
                      label="end"
                      InputLabelProps={{ shrink: true }}
                      type="date"
                      variant="standard"
                      value={entryForm.sickLeave?.endDate}
                      onChange={({ target }) =>
                        setEntryForm({
                          ...entryForm,
                          sickLeave: {
                            ...entryForm.sickLeave,
                            endDate: target.value,
                            startDate: entryForm.sickLeave?.startDate || "",
                          },
                        })
                      }
                      fullWidth
                    />
                  </div>
                </div>
              </div>
            )}

            {type?.value === "Hospital" && (
              <div style={{ paddingTop: "10px" }}>
                <FormLabel>Discharge</FormLabel>
                <div style={{ padding: "10px" }}>
                  <TextField
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    label="date"
                    variant="standard"
                    value={entryForm.discharge.date}
                    onChange={({ target }) =>
                      setEntryForm({
                        ...entryForm,
                        discharge: {
                          ...entryForm.discharge,
                          date: target.value,
                        },
                      })
                    }
                    fullWidth
                  />
                  <TextField
                    label="criteria"
                    variant="standard"
                    value={entryForm.discharge.criteria}
                    onChange={({ target }) =>
                      setEntryForm({
                        ...entryForm,
                        discharge: {
                          ...entryForm.discharge,
                          criteria: target.value,
                        },
                      })
                    }
                    fullWidth
                  />
                </div>
              </div>
            )}

            <div style={{ paddingTop: "5px" }}>
              <FormLabel>Select type</FormLabel>
              <div>
                <SelectA value={type} options={options} onChange={setOption} />
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => setShowCancel(!showCancel)}
            >
              {showCancel ? "cancel" : "show"}
            </Button>
            <Button
              variant="contained"
              color="inherit"
              type="submit"
              style={{ display: showCancel ? "" : "none" }}
            >
              ADD
            </Button>
          </div>
        </div>
      </form>

      <div>
        <h3>entries</h3>
        {patient.entries.map((entry) => {
          console.log("entry ", entry);
          switch (entry.type) {
            case "HealthCheck":
              return <HealthCheckEntryDetails entry={entry} key={entry.id} />;

            case "Hospital":
              return <HospitalEntryDetails entry={entry} key={entry.id} />;
            case "OccupationalHealthcare":
              return (
                <OccupationalHealthcareEntryDetails
                  entry={entry}
                  key={entry.id}
                />
              );
            default:
              return assertNever(entry);
          }
        })}
      </div>
    </div>
  );
};

export default PatientDetails;
