const lintProcess = exec("eslint ../../src --fix")
lintProcess.stdout.on("data", (data) => {
  console.log(data);
});
lintProcess.stderr.on("data", (data) => {
  console.error(data);
});