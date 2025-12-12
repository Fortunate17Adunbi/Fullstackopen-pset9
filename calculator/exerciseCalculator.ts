import { parseData } from "./utils";

interface Metric {
  target: number;
  hoursPerDay: number[];
}

const parseArgument = (args: string[]): Metric => {
  if (args.length < 5) {
    throw new Error("Required argument not enough: Requires at least 3");
  }
  const data = parseData(args);
  return {
    target: data[0],
    hoursPerDay: data.slice(1),
  };
};

type COMMENT =
  | "Execellent, You crushed it"
  | "Not too bad but could be better"
  | "Bad, not the expected result";

interface ExcersiseReview {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: COMMENT;
  target: number;
  average: number;
}

export const calculateExercises = (
  hoursPerDay: number[],
  target: number
): ExcersiseReview => {
  const trainingDays = hoursPerDay.filter((hours) => hours != 0);
  const totalHours = trainingDays.reduce((sum, hour) => {
    return sum + hour;
  }, 0);
  // console.log("total hours ", totalHours);
  // console.log("train length ", trainingDays.length);
  const average = totalHours / hoursPerDay.length;

  let rating: number;
  let ratingDescription: COMMENT;

  if (average < target / 2) {
    rating = 1;
    ratingDescription = "Bad, not the expected result";
  } else if (average >= target / 2 && average < target) {
    rating = 2;
    ratingDescription = "Not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "Execellent, You crushed it";
  }

  return {
    periodLength: hoursPerDay.length,
    trainingDays: trainingDays.length,
    success: target === average,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (require.main === module) {
  try {
    const { target, hoursPerDay } = parseArgument(process.argv);
    console.log(`Target: ${target}, Hours Per Day: ${hoursPerDay}`);
    console.log(calculateExercises(hoursPerDay, target));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}
