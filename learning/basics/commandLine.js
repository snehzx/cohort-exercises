const fs = require("fs");
const { Command } = require("commander");
const program = new Command();

program
  .name("counter")
  .description("CLI to do file based tasks")
  .version("0.8.0");

program
  .command("count_words")
  .description("count the number of words in a file")
  .argument("<file>", "file to count")
  .action((file) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(data.split(" ").length);
      }
    });
  });
program
  .command("count_sentences")
  .description("count the number of words in a file")
  .argument("<file>", "file to count")
  .action((file) => {
    fs.readFile(file, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
        return;
      } else {
        console.log(data.split("\n").length);
      }
    });
  });
program.parse();
