const { exec } = require("child_process");

const buildProcess = exec(`${require("./buildCommand")} && node ./node_modules/pigeon-mode-game-library/cli/zip.js`);

buildProcess.stdout.on("data", (data) => {
  console.log(data);
});
buildProcess.stderr.on("data", (data) => {
  console.error(data);
});