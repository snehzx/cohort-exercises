// Problem Statement:
// Write a function mergeObjects that merges two objects and returns a new object with all properties.
export function mergeObjects<T, K>(obj1: T, obj2: K): T & K {
  return { ...obj1, ...obj2 };
}
