// Problem Statement
// Define an interface Vehicle with the following properties and methods:
// make: A string representing the brand of the vehicle.
// model: A string representing the model of the vehicle.
// year: A number representing the year of manufacture.
// A method getDetails that returns a formatted string with vehicle details.
// Create a class Car that implements the Vehicle interface:
// The class should include a constructor to initialize the make, model, and year.
// Implement the getDetails method to return a formatted string like:
// "This is a 2020 Tesla Model S."

export interface Vehicle {
  make: String;
  model: String;
  year: number;
  getDetails: () => String;
}

export class Car implements Vehicle {
  make: String;
  model: String;
  year: number;

  constructor(make: String, model: String, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
  getDetails() {
    return `This is a ${this.year} ${this.make} ${this.model}.`;
  }
}

// Example Input
// const car = new Car('Tesla', 'Model S', 2020);
// console.log(car.getDetails());
// Example Output
// "This is a 2020 Tesla Model S."
