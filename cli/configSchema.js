const { generate } = require("ts-to-zod");

module.exports.configSchema = generate(readFileSync(join(__dirname, "..", "api", "interfaces", "Config.ts")).toString());