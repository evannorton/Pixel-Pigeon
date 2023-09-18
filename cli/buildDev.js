const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(resolve(), "dev.pmgf"), join(__dirname, "..", "out", "dev.pmgf"));