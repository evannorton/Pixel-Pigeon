const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(resolve(join(__dirname, "..", "..", "..", "project.ldtk")), resolve(join(__dirname, "..", "out", "project.ldtk")))