const { writeFileSync } = require("fs");
const { join, resolve } = require("path");
const getPPEnv = require("./getPPEnv");

const ppEnv = getPPEnv();

if (ppEnv !== null) {
  writeFileSync(
    join(resolve(), "out", "pp-env.json"),
    JSON.stringify(ppEnv),
  );
}
