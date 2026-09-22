// Problem Statement:
// Write a generic function sum that accepts an array of numbers and returns the sum of all the numbers.
export function sum(arr: number[]): number {
  let sum: number = 0;
  for (const num of arr) {
    sum += num;
  }
  return sum;
}
