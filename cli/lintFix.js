const { exec } = require("child_process");
const { join } = require("path");

const lintProcess = exec(`linter lint:fix ${process.argv[3]}`);

lintProcess.stdout.on("data", (data) => {
  console.log(data);
});
lintProcess.stderr.on("data", (data) => {
  console.error(data);
});