const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(resolve(), "pp-config.json"), join(__dirname, "..", "out", "pp-config.json"));