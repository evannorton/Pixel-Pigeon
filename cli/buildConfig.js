const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(resolve(join(__dirname, "..", "..", "..", "config.pmgl")), resolve(join(__dirname, "..", "out", "config.pmgl")))