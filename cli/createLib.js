const { existsSync, mkdirSync, rmSync } = require("fs");
const { join } = require("path");

const path = join(__dirname, "..", "lib");
if (existsSync(path)) {
  rmSync(path, { recursive: true });
}
mkdirSync(path);