import { useState, useEffect } from "react";
import axios from "axios";
import { Route, Link, Routes, useMatch } from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { Patient } from "./types";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientDetails from "./components/PatientDetails";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patient, setPatient] = useState<Patient>();
  const match = useMatch("/patients/:id");
  const id = match ? match.params.id : "";

  console.log("match ", match);
  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  useEffect(() => {
    if (id) {
      patientService
        .getPatient(id)
        .then((patient) => {
          setPatient(patient);
        })
        .then((error: unknown) => {
          if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
          } else {
            console.log("error occured");
          }
        });
    }
  }, [match]);

  return (
    <div className="App">
      <Container>
        <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
          Patientor
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">
          Home
        </Button>
        <Divider hidden />
        <Routes>
          <Route
            path="/"
            element={
              <PatientListPage patients={patients} setPatients={setPatients} />
            }
          />
          <Route
            path={"/patients/:id"}
            element={<PatientDetails patient={patient} setPatient={setPatient} />}
          />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
