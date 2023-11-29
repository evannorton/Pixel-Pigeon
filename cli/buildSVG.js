const { copyDirectorySync } = require("./utils");
const { join, resolve } = require("path");

copyDirectorySync(join(__dirname, "..", "svg"), join(resolve(), "out", "svg"));