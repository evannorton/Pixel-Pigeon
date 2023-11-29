const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(resolve(), "pp-dev.json"), join(resolve(), "out", "pp-dev.json"));