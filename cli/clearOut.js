const { rmSync } = require('fs');
const { join, resolve } = require("path");

rmSync(join(resolve(), "out"), { recursive: true, force: true });