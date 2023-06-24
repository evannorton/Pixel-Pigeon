const { copyDirectorySync } = require("./utils");
const { join } = require("path");

copyDirectorySync(join(__dirname, "..", "..", "..", "images"), join(__dirname, "..", "out", "images"));