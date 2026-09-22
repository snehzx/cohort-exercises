// Problem Statement:
// Write a function identity that takes an argument of any type and returns the same type.

export function identity<T>(args: T): T {
  return args;
}
