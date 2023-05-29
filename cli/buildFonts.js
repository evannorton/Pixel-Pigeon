const { copyFileSync, existsSync, mkdirSync, readdirSync } = require("fs");
const { join, resolve } = require("path");

if (!existsSync(resolve(join(__dirname, "..", "out", "fonts")))) {
  mkdirSync(resolve(join(__dirname, "..", "out", "fonts")));
}

for (const file of readdirSync(resolve(join(__dirname, "..", "fonts")))) {
  copyFileSync(resolve(join(__dirname, "..", "fonts", file)), resolve(join(__dirname, "..", "out", "fonts", file)))
}
