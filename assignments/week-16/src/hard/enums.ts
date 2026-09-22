// Problem Statement
// Write a function that describes a selected seat position on a flight.

// Use an enum to represent the possible seat positions: Window, Middle, and Aisle.
// The function should take the seat position as input and return a corresponding message.
// If the input is invalid, the function should throw an error.
// Ensure proper type annotations and error handling.

export enum SeatPosition {
  Window = "window",
  Middle = "middle",
  Aisle = "aisle",
}

export function getSeatDescription(seatPosition: SeatPosition): string {
  switch (seatPosition) {
    case SeatPosition.Window:
      return `You have selected a window seat.`;
    case SeatPosition.Middle:
      return `You have selected a middle seat.`;
    case SeatPosition.Aisle:
      return `You have selected an aisle seat.`;
    default:
      throw new Error("Invalid seat position");
  }
}
// Example Input:
// SeatPosition.Window

// Example Output:
// "You have selected a window seat."
