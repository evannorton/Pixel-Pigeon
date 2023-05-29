const { copyFileSync, existsSync, mkdirSync, readdirSync } = require("fs");
const { join, resolve } = require("path");

if (!existsSync(resolve(join(__dirname, "..", "out", "images")))) {
  mkdirSync(resolve(join(__dirname, "..", "out", "images")));
}

for (const file of readdirSync(resolve(join(__dirname, "..", "..", "..", "images")))) {
  copyFileSync(resolve(join(__dirname, "..", "..", "..", "images", file)), resolve(join(__dirname, "..", "out", "images", file)))
}
