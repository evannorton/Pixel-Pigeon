const { copyDirectorySync } = require("./utils");
const { join, resolve } = require("path");

copyDirectorySync(join(__dirname, "..", "mp3"), join(resolve(), "out", "mp3"));