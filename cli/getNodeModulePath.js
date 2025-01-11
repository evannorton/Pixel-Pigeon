const { existsSync } = require("fs");
const { join, resolve } = require("path");

module.exports = (path) => {
  if (existsSync(join(__dirname, "..", "node_modules", ...path))) {
    return join(__dirname, "..", "node_modules", ...path);
  }
  if (existsSync(join(resolve(), "node_modules", ...path))) {
    return join(resolve(), "node_modules", ...path);
  }
  throw new Error("Could not get node_modules path.");
}