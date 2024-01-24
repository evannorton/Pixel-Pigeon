const { existsSync, copyFileSync, writeFileSync } = require("fs");
const { join, resolve } = require("path");

if (existsSync(join(resolve(), "pp-id.json"))) {
  copyFileSync(join(resolve(), "pp-id.json"), join(resolve(), "out", "pp-id.json"));
}
else {
  writeFileSync(join(resolve(), "out", "pp-id.json"), JSON.stringify(null));
}