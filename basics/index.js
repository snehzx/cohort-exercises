// const fs = require("fs");

const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000);
});
p.then((value) => {
  console.log(value);
}).catch("error");

// fs.readFile("a.txt", "utf-8", function fxn(err, data) {
//   if (err) {
//     console.log("error", err);
//     console.log(typeof err);
//   } else {
//     console.log(data);
//   }
// });
