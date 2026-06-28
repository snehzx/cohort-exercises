//generics are for funcitions classes or types that access parameterss

function getLastEle<T>(arr: T[]): T | undefined {
  return arr[0];
}
// if its a string arr ts can figure it out itself without refering it
console.log(getLastEle<string>(["hii", "baby"]));
console.log(getLastEle<number>([]));
