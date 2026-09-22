// Write a function that multiplies the results of two functions. Each function returns a number when called.
// Ensure the functions have proper type annotations.
// Example Input: f1 = () => 2, f2 = () => 3
// Example Output: 6
export function multiplyResults(f1: () => number, f2: () => number): number {
  return f1() * f2();
}
