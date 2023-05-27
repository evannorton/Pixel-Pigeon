const { generate } = require("ts-to-zod");
const { readFileSync } = require("fs");

module.exports.configSchema = generate(readFileSync(join(__dirname, "..", "api", "interfaces", "Config.ts")).toString());