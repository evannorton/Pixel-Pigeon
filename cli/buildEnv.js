const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(resolve(), "pp-env.json"), join(__dirname, "..", "out", "pp-env.json"));