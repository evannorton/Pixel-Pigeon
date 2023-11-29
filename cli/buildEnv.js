const { existsSync, copyFileSync } = require("fs");
const { join, resolve } = require("path");

if (existsSync(join(resolve(), "pp-env.json"))) {
  copyFileSync(join(resolve(), "pp-env.json"), join(resolve(), "out", "pp-env.json"));
}