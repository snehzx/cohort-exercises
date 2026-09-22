// Problem Statement:
// Write a function isEligibleForDriving that takes a user object as input and returns true if the user is eligible for a driving license (age >= 16), and false otherwise. Ensure the function has proper type annotations.

export interface User {
  name: String;
  age: number;
}

export function isEligibleForDriving(user: User): boolean {
  return user.age >= 16;
}

// Example Input:
// user = { name: "Alice", age: 20 }
// Example Output:
// true
