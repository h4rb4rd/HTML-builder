const process = require("process");
const readline = require("readline");
const fs = require("fs");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const filePath = path.join(__dirname, "text.txt");

rl.question("Enter your text:\n", (userInput) => {
  if (userInput.toLowerCase() == "exit") {
    rl.close();
  }

  fs.writeFile(filePath, userInput, (error) => {
    error ? console.log(error) : null;
  });
  rl.on("line", (userInput) => {
    fs.appendFile(filePath, userInput, (error) => {
      error ? console.log(error) : null;
    });
  });
});

rl.on("close", () => {
  console.log("Goodbye!");
});
