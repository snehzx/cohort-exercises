// convert string to binary value
const binaryRep = new TextEncoder().encode("hello");
console.log(binaryRep);

// Uint8Array
const arr = new Uint8Array([1999]);
console.log(arr);

//not the correct way to convert just the idea
const binaryRep2 = new TextEncoder().encode("hsirwoiehdaksdjf");
console.log(binaryRep2);

// convert arr to hex
function arrToHex(arr2) {
  let hexString = "";
  for (let i = 0; i < arr2.length; i++) {
    hexString += arr2[i].toString(16).padStart(2, "0");
  }
  return hexString;
}
const arr2 = new Uint8Array([104, 101, 108, 108, 111]);
console.log(arrToHex(arr2));
