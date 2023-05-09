const { existsSync, mkdirSync, rmSync } = require("fs");
const { join } = require("path");

const paths = [join(__dirname, "..", "library-lib"), join(__dirname, "..", "game-lib")];
for (const path of paths) {
  if (existsSync(path)) {
    rmSync(path, { recursive: true });
  }
  mkdirSync(path);
}