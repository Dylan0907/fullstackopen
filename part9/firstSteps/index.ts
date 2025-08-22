import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercise } from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    res.status(400).json({ error: "parameters missing" });
  }

  const parsedHeight = Number(height);
  const parsedWeight = Number(weight);

  if (isNaN(parsedHeight) || isNaN(parsedWeight)) {
    res.status(400).json({ error: "malformatted parameters" });
  }
  const bmi: string = calculateBmi(parsedHeight, parsedWeight);
  res.json({
    ...req.query,
    bmi: bmi
  });
});

app.post("/exercises", (req, res) => {
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }
  const parsedTarget = Number(target);
  const parsedExercises = daily_exercises.map((n: number) => Number(n));

  if (isNaN(parsedTarget) || parsedExercises.some((n: number) => isNaN(n))) {
    return res.status(400).json({ error: "malformatted parameters" });
  }
  const result = calculateExercise(parsedTarget, parsedExercises);

  return res.json({ result });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
