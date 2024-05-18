const { copyFileSync, existsSync } = require("fs");
const { join, resolve } = require("path");

if (existsSync(join(resolve(), "project.ldtk"))) {
  copyFileSync(join(resolve(), "project.ldtk"), join(resolve(), "out", "project.ldtk"));
}