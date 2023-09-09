const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(resolve(), "config.pmgf"), join(__dirname, "..", "out", "config.pmgf"));