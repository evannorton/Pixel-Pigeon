const { copyFileSync, existsSync, mkdirSync, readdirSync } = require("fs");
const { join, resolve } = require("path");

if (!existsSync(resolve(join(__dirname, "..", "out", "cursors")))) {
  mkdirSync(resolve(join(__dirname, "..", "out", "cursors")));
}

for (const file of readdirSync(resolve(join(__dirname, "..", "cursors")))) {
  copyFileSync(resolve(join(__dirname, "..", "cursors", file)), resolve(join(__dirname, "..", "out", "cursors", file)))
}
