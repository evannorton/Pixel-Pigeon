const { copyFileSync } = require("fs");
const { join, resolve } = require("path");
const nodeModulesPath = require("./nodeModulesPath");

copyFileSync(join(nodeModulesPath, "notyf", "notyf.min.css"), join(resolve(), "out", "toasts.css"))