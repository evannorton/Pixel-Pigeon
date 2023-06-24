const { copyDirectorySync } = require("./utils");
const { join } = require("path");
const { existsSync } = require("fs");

if (!existsSync(join("images"))) {
    throw new Error("You must create an images folder for use with Pigeon Mode Game Library.");
}

copyDirectorySync(join(__dirname, "..", "..", "..", "images"), join(__dirname, "..", "out", "images"));