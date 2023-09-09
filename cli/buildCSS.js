const { copyFileSync } = require("fs");
const { join } = require("path");

copyFileSync(join(__dirname, "..", "style.css"), join(__dirname, "..", "out", "style.css"))