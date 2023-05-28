const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(resolve(join(__dirname, "..", "..", "normalize.css", "normalize.css")), resolve(join(__dirname, "..", "out", "normalize.css")))