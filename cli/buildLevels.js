const { copyDirectorySync } = require("./utils");
const { join } = require("path");
copyDirectorySync(join(__dirname, "..", "..", "..", "levels"), join(__dirname, "..", "out", "levels"));