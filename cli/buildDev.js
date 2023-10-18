const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(resolve(), "pp-dev.json"), join(__dirname, "..", "out", "pp-dev.json"));