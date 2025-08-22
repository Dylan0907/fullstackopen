type ExerciseCalculatorValues = {
  value1: number;
  value2: number[];
};

const parseArguments = (args: string[]): ExerciseCalculatorValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  const value2 = args.slice(3).map(Number);
  const areNumbers = value2.every((elem) => !isNaN(elem));
  if (value2.some((h) => h < 0)) {
    throw new Error("Exercise hours cannot be negative.");
  }
  if (!isNaN(Number(args[2])) && areNumbers) {
    return {
      value1: Number(args[2]),
      value2: value2
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercise = (
  target: number,
  dailyExerciseHours: number[]
): Result => {
  const periodLength: number = dailyExerciseHours.length;
  const trainingDays: number = dailyExerciseHours.filter(
    (hours) => hours > 0
  ).length;
  const average: number =
    dailyExerciseHours.reduce((acc, val) => acc + val, 0) /
    dailyExerciseHours.length;
  const success: boolean = average >= target;
  const ratio: number = average / target;
  let rating: 1 | 2 | 3;
  let ratingDescription: string;
  if (ratio >= 1) {
    rating = 3;
    ratingDescription = "Excellent job, you've met your goal!";
  } else if (ratio >= 0.5) {
    rating = 2;
    ratingDescription = "Not too bad but could be better.";
  } else {
    rating = 1;
    ratingDescription = "You need to improve your consistency.";
  }
  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

try {
  const { value1, value2 } = parseArguments(process.argv);
  console.log("Your training report:");
  console.log(JSON.stringify(calculateExercise(value1, value2), null, 2));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
