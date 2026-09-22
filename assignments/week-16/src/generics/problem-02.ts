// Problem Statement:
// Write a function createPair that takes two arguments of any type and returns a tuple with those values.
export function createPair<T, K>(args1: T, args2: K): (T | K)[] {
  return [args1, args2];
}
