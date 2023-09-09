const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(resolve(), "project.ldtk"), join(__dirname, "..", "out", "project.ldtk"));