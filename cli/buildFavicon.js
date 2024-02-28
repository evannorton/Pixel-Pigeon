const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(__dirname, "..", "favicon.ico"), join(resolve(), "out", "favicon.ico"))