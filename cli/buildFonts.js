const { join, resolve } = require("path");
const { copyDirectorySync } = require("./utils");

copyDirectorySync(join(__dirname, "..", "fonts"), join(resolve(), "out", "fonts"));

