import express, { Response, Request, NextFunction } from "express";
import { z } from "zod";
import patientsService from "../services/patientsService";
import { NewPatientSchema, parseEntryReq } from "../utils";
import { NewPatient, Patient, SafePatient } from "../types";

const router = express.Router();

router.get("/", (_req, res: Response<SafePatient[]>) => {
  res.send(patientsService.getPatients());
});
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const patient = patientsService.findPatient(id);
  console.log("patinet who ", patient);
  if (patient) {
    res.send(patientsService.findPatient(id));
  } else {
    // console.log("inhere");
    res.status(404).json({ error: "Patient not found" });
  }
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
// const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
//   try {
//     z.object({
//       id: z.string(),
//     }).parse(req.params);
//     next();
//   } catch (error: unknown) {
//     next(error);
//   }
// };
const Param = z.object({
  id: z.string(),
});
router.post(
  "/:id/entries",
  // newEntryParser,
  (
    req: Request<z.infer<typeof Param>, unknown, NewPatient>,
    res: Response<Patient>
  ) => {
    const parsedReq = parseEntryReq(req.body);
    console.log("parsed req ", parsedReq, " id  ", req.params.id);
    const patient = patientsService.addEntry(req.params.id, parsedReq);
    console.log(patient);
    if (patient) {
      res.json(patient);
    } else {
      throw new Error("Error adding entry ");
    }
  }
);

router.use(errorHandler);

export default router;
