const { copyFileSync } = require("fs");
const { join } = require("path");
const nodeModulesPath = require("./nodeModulesPath");

copyFileSync(join(nodeModulesPath, "normalize.css", "normalize.css"), join(__dirname, "..", "out", "normalize.css"))