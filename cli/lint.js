const { exec } = require("child_process");

const lintProcess = exec(`linter lint ${process.argv[3]}`);

lintProcess.stdout.on("data", (data) => {
  console.log(data);
});
lintProcess.stderr.on("data", (data) => {
  console.error(data);
});