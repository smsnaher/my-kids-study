export const sumTemplate = (numbers: number[]) => {
  const total = numbers.reduce((acc, curr) => acc + curr, 0);
  return `The sum of ${numbers.join(", ")} is ${total}.`;
};

export const subtractionTemplate = (minuend: number, subtrahend: number) => {
  const difference = minuend - subtrahend;
  return `The difference between ${minuend} and ${subtrahend} is ${difference}.`;
};

export const sumAdminTemplate = (numbers: number[]) => {
  return `What is the sum of ${numbers.join(" + ")} = ?`;
};
export const sumStudentTemplate = (numbers: number[]) => {
  return `What is the sum of ${numbers.join(" + ")} = ?`;
};
