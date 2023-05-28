const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(resolve(join(__dirname, "..", "style.css")), resolve(join(__dirname, "..", "out", "style.css")))