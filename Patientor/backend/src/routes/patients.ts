import express, { Response, Request, NextFunction } from "express";
import { z } from "zod";
import patientsService from "../services/patientsService";
import { NewPatientSchema } from "../utils";
import { NewPatient, Patient, SafePatient } from "../types";

const router = express.Router();

router.get("/", (_req, res: Response<SafePatient[]>) => {
  res.send(patientsService.getPatients());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
    next();
  } else {
    next(error);
  }
};
router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientsService.savePatient(req.body);
    res.json(addedPatient);
  }
);

router.use(errorHandler);

export default router;
