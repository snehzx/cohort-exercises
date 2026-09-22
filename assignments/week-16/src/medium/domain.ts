// Problem Statement:
// Create an interface User with properties firstName, lastName, email, and age.
// Write a function isAllowedDomain that checks if the user's email ends with a specific domain (e.g., "@example.com").
// The function should return true if the domain matches and false otherwise.

export interface User {
  firstName: String;
  lastName: String;
  email: String;
  age: number;
}

export function isAllowedDomain(user: User, allowedDomain: String) {
  const domain = user.email.split("@")[1];
  if (`@${domain}` === allowedDomain) {
    return true;
  }
  return false;
}

// Example Input:
// const user = {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     age: 25
//   };
//   const allowedDomain = "@example.com";
// Example Output:
// true
