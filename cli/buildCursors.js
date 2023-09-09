const { join } = require("path");
const { copyDirectorySync } = require("./utils");

copyDirectorySync(join(__dirname, "..", "cursors"), join(__dirname, "..", "out", "cursors"));

