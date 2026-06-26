// Problem Statement
// Create a type named Shape that can be either a Circle or a Rectangle.

// A Circle should have a property radius (a number).
// A Rectangle should have properties width and height (both numbers).
// Write a function getArea that takes a Shape as input and returns its area.

// For a Circle, the area is calculated as π * radius².
// For a Rectangle, the area is calculated as width * height.

type Circle = {
  radius: number;
};

type Rectangle = {
  width: number;
  height: number;
};
export type Shape = Circle | Rectangle;

export function getArea(shape: Shape) {
  if ("radius" in shape) {
    return Math.PI * shape.radius ** 2;
  } else if ("width" in shape && "height" in shape) {
    return shape.width * shape.height;
  } else {
    throw new Error("invalid shape");
  }
}

// Example Input 1:

// const circle: Shape = { radius: 5 };
// console.log(getArea(circle));

// Example Output 1:

// 78.53981633974483
