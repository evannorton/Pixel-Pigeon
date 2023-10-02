const { copyDirectorySync } = require("./utils");
const { join } = require("path");

copyDirectorySync(join(__dirname, "..", "mp3"), join(__dirname, "..", "out", "mp3"));