const { exec } = require("child_process");
const killPort = require("kill-port");
const { readFileSync, existsSync } = require("fs");
const { join, resolve } = require("path");

const port = existsSync(join(resolve(), "pp-dev.json")) ? JSON.parse(readFileSync(join(resolve(), "pp-dev.json"))) : 3000;

killPort(port)
  .catch(() => { })
  .finally(() => {
    const commands = JSON.parse(
      readFileSync(join(__dirname, "watchExec.json")).toString()
    );
    const handleWatchProcess = exec(
      [
        `node ${join(__dirname, "validate")}`,
        ...commands,
        "node ./node_modules/pixel-pigeon/cli/markExecCompleted",
        "node ./node_modules/pixel-pigeon/server",
      ].join(" && ")
    );
    handleWatchProcess.stdout.on("data", (data) => {
      console.log(data);
    });
    handleWatchProcess.stderr.on("data", (data) => {
      console.error(data);
    });
  });
