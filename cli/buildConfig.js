const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(resolve(), "pp-config.json"), join(resolve(), "out", "pp-config.json"));