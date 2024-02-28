const { mkdirSync, rmSync, existsSync } = require("fs");
const { resolve } = require("path");

const directory = resolve(resolve(), "out");
if (existsSync(directory)) {
  rmSync(directory, { recursive: true, force: true });
}

mkdirSync(directory);