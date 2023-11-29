const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(__dirname, "..", "style.css"), join(resolve(), "out", "style.css"))