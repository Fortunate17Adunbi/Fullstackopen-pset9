import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";
const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});
app.get("/bmi", (req, res) => {
  const weight = Number(req.query.weight);
  const height = Number(req.query.height);
  if (isNaN(weight) || isNaN(height)) {
    res.status(400).send({ error: "malformatted parameters" });
    return;
  }

  const bmi = calculateBmi(height, weight);
  res.json({ weight, height, bmi });
});
app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { target, daily_exercises } = req.body;
  if (!target || !daily_exercises) {
    res.status(400).send({ error: "parameters missing" });
    return;
  } else if (!Array.isArray(daily_exercises)) {
    res.status(400).send({ error: "malformatted parameters" });
    return;
  }

  const setTarget = Number(target);
  const exercisePerDay = (daily_exercises as unknown[]).map((h) => Number(h));
  // console.log("gooo ", setTarget, exercisePerDay);
  if (isNaN(setTarget) || exercisePerDay.some((h) => isNaN(h))) {
    res.status(400).send({ error: "malformatted parameters" });
    return;
  }

  const result = calculateExercises(exercisePerDay, setTarget);

  // console.log(daily_exercises, target);
  res.json({ result });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
