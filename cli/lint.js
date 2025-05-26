const { exec } = require("child_process");

const lintProcess = exec("linter lint ./src");

lintProcess.stdout.on("data", (data) => {
  console.log(data);
});
lintProcess.stderr.on("data", (data) => {
  console.error(data);
});