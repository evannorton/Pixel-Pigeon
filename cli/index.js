#!/usr/bin/env node

const { existsSync, writeFileSync, readFileSync } = require("fs");
const { join } = require("path");
const { generate } = require("ts-to-zod");

const configSchemaText = generate({ sourceText: readFileSync(join(__dirname, "..", "api", "types", "Config.ts")).toString() }).getZodSchemasFile();
writeFileSync(join(__dirname, "configSchema.js"), configSchemaText.replace("import { z } from \"zod\";", "const { z } = require(\"zod\");") + "\n" + "module.exports = { configSchema };");
const { configSchema } = require("./configSchema");

if (!existsSync(join("pmgl.json"))) {
    throw new Error("You must create a pmgl.json file for use with Pigeon Mode Game Library.");
}
const configString = readFileSync(join("pmgl.json")).toString();
try {
    JSON.parse(configString);
}
catch (error) {
    throw new Error("Your pmgl.json file is not valid JSON.");
}
try {
    configSchema.parse(JSON.parse(configString));
}
catch (error) {
    console.error("Your pmgl.json file does not match the schema.");
    throw error;
}

switch (process.argv[2]) {
    case "dev":
        require("./watch");
        break;
    case "zip":
        require("./build");
        break;
    case "lint":
        require("./lint");
        break;
    case "lint:fix":
        require("./lintFix");
        break;
    default:
        console.log("xD");
        break;
}