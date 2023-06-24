const { join, resolve } = require("path");
const { copyDirectorySync } = require("./utils");

copyDirectorySync(resolve(join(__dirname, "..", "fonts")), resolve(join(__dirname, "..", "out", "fonts")));

