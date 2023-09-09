const { join } = require("path");
const { copyDirectorySync } = require("./utils");

copyDirectorySync(join(__dirname, "..", "fonts"), join(__dirname, "..", "out", "fonts"));

