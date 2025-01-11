const { copyFileSync } = require("fs");
const { join, resolve } = require("path");
const getNodeModulePath = require("./getNodeModulePath");

copyFileSync(getNodeModulePath(["normalize.css", "normalize.css"]), join(resolve(), "out", "normalize.css"))