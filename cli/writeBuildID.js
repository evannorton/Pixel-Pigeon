const { writeFileSync } = require("fs");
const { join } = require("path");
const { argv } = require("process");

const buildID = argv[2];

writeFileSync(join(__dirname, "..", "build-id.json"), JSON.stringify(buildID));
