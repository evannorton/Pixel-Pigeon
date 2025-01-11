const { copyFileSync } = require("fs");
const { join, resolve } = require("path");
const getNodeModulePath = require("./getNodeModulePath");

copyFileSync(getNodeModulePath(["notyf", "notyf.min.css"]), join(resolve(), "out", "toasts.css"))