const { copyFileSync } = require("fs");
const { join, resolve } = require("path");
const nodeModulesPath = require("./nodeModulesPath");

copyFileSync(join(nodeModulesPath, "normalize.css", "normalize.css"), join(resolve(), "out", "normalize.css"))