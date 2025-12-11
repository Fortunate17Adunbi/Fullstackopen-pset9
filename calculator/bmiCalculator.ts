import { parseData } from "./utils";

interface Metric {
  weight: number;
  height: number;
}
type BMI = "Underweight" | "Normal Range" | "Overweight" | "Obese";

const parseArgument = (args: string[]): Metric => {
  if (args.length < 4)
    throw new Error("Required argument not enough: REQUIRED (2)");
  if (args.length > 4)
    throw new Error("Argument provided is more than the required (2)");

  const data = parseData(args);
  return {
    weight: data[1],
    height: data[0],
  };
};

export const calculateBmi = (height: number, weight: number): BMI => {
  const heightInMeters = height / 100;
  const result = weight / (heightInMeters * heightInMeters);
  // console.log("result ", result);
  if (result < 18.5) {
    return "Underweight";
  } else if (result < 25) {
    return "Normal Range";
  } else if (result < 30) {
    return "Overweight";
  } else {
    return "Obese";
  }
};

if (require.main === module) {
  try {
    const { weight, height } = parseArgument(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}
