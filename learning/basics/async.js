const fs = require("fs");
function fsReadFilePromisified(filePath, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, encoding, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

async function main() {
  let file1 = await fsReadFilePromisified("a.txt", "utf-8");
  let file2 = await fsReadFilePromisified("b.txt", "utf-8");
  let file3 = await fsReadFilePromisified("c.txt", "utf-8");
  console.log(file1);
  console.log(file2);
  console.log(file3);
}
main();
