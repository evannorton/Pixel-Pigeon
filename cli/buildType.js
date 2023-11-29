const { copyFileSync } = require("fs");
const { join, resolve } = require("path");

copyFileSync(join(__dirname, "type.json"), join(resolve(), "out", "type.json"));