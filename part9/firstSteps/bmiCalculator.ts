type bmiCalculatorValues = {
  value1: number;
  value2: number;
};

export const parseArgumentsBmi = (args: string[]): bmiCalculatorValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

// Function to calculate BMI and return the weight category
export const calculateBmi = (heightCm: number, weightKg: number): string => {
  if (heightCm <= 0 || weightKg <= 0) {
    return "Invalid input: height and weight must be positive numbers.";
  }

  // Convert height from cm to meters and calculate BMI
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 16.0) return "Underweight (Severe thinness)";
  if (bmi < 17.0) return "Underweight (Moderate thinness)";
  if (bmi < 18.5) return "Underweight (Mild thinness)";
  if (bmi < 25.0) return "Normal range";
  if (bmi < 30.0) return "Overweight (Pre-obese)";
  if (bmi < 35.0) return "Obese (Class I)";
  if (bmi < 40.0) return "Obese (Class II)";
  return "Obese (Class III)";
};

try {
  const { value1, value2 } = parseArgumentsBmi(process.argv);
  console.log("Your BMI report:");
  console.log(calculateBmi(value1, value2));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
