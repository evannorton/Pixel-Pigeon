const { join, resolve } = require("path");
const { copyDirectorySync } = require("./utils");

copyDirectorySync(resolve(join(__dirname, "..", "cursors")), resolve(join(__dirname, "..", "out", "cursors")));

