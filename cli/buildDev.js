const { existsSync, copyFileSync } = require("fs");
const { join, resolve } = require("path");

if (existsSync(join(resolve(), "pp-dev.json"))) {
  copyFileSync(join(resolve(), "pp-dev.json"), join(resolve(), "out", "pp-dev.json"));
}