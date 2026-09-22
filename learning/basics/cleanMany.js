// a promisified function that takes a file prefix as an input(a) and cleans prefix1.txt , prefix2.txt ..
const fs = require("fs");

function cleanFile(filepath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        const trimData = data.trim();
        fs.writeFile(filepath, trimData, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      }
    });
  });
}

// function cleanManyFile(prefix) {
//   return new Promise(async function (resolve, reject) {
//     try {
//       await cleanFile(prefix + "1.txt");
//       await cleanFile(prefix + "2.txt");
//       await cleanFile(prefix + "3.txt");
//       resolve();
//     } catch (err) {
//       reject();
//     }
//   });
// }
cleanManyFile("a")
  .then(() => {
    console.log("all three files have been cleaned");
  })
  .catch(() => {
    console.log("error while cleaning");
  });

// or a even better wayy
async function cleanManyFile(prefix) {
  await cleanFile(prefix + "1.txt");
  await cleanFile(prefix + "2.txt");
  await cleanFile(prefix + "3.txt");
}
