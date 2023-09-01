const { copyDirectorySync } = require("./utils");
const { join } = require("path");

copyDirectorySync(join(__dirname, "..", "svg"), join(__dirname, "..", "out", "svg"));