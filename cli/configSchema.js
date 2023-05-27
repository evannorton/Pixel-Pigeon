const { generate } = require("ts-to-zod");
const { readFileSync } = require("fs");
const { join } = require("path");

module.exports.configSchema = generate(readFileSync(join(__dirname, "..", "api", "interfaces", "Config.ts")).toString());