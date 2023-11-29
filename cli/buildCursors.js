const { join, resolve } = require("path");
const { copyDirectorySync } = require("./utils");

copyDirectorySync(join(__dirname, "..", "cursors"), join(resolve(), "out", "cursors"));

