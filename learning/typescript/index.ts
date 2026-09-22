function sum(a: number, b: number) {
  return a + b;
}

//functional arg - explicit inference

let x: number = 3;
let y: number = 2;
console.log(sum(x, y));

function first_element(arr: number[]): number | null {
  //composite types
  if (arr.length > 0) {
    return arr[0] ?? null; //the typescript compiler feels that arr[0] can be undefined
  } else {
    return null;
  }
}
console.log(first_element([1, 2, 3]));
//?? and ||

interface User {
  name: String;
  age: number;
}

function isLegal(user: User): boolean {
  return user.age > 18;
}
console.log(isLegal({ name: "sneha", age: 20 }));
