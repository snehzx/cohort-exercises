// Write a function that checks if a number is a multiple of another number.
// The function should return true if the first number is divisible by the second number, otherwise false.
// Ensure the function has proper type annotations.
// Example Input: num = 15, divisor = 5
// Example Output: true
export function isMultipleOf(num1: number, num2: number): boolean {
  if (num1 % num2 === 0) {
    return true;
  }
  return false;
}
