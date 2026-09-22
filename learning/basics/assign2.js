//async and callback way of appending a file
const fs = require("fs");
function cleanFile(filepath, callback) {
  fs.readFile(filepath, "utf-8", (err, data) => {
    const trimData = data.trim();
    fs.writeFile("a.txt", trimData, () => {
      callback();
    });
  });
}

cleanFile("a.txt", () => {
  console.log("done");
});

//promisified version
function cleanFile2(filepath) {
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

cleanFile2("a.txt")
  .then(() => {
    console.log("file has been cleaned");
  })
  .catch((err) => {
    console.log("error while cleaning", err);
  });

//.then is a microtask and gets preferred over macrotasks like callbacks

// async-await

async function main() {
  try {
    await cleanFile2("a.txt");
    console.log("done cleaningg");
  } catch (err) {
    console.log("error while cleaningg");
  }
}
main();
