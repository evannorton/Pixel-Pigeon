const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const html = readFileSync(join(__dirname, "..", "template.mustache")).toString();

writeFileSync(join(__dirname, "..", "out", "index.html"), html);