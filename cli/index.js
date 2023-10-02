#!/usr/bin/env node

const { existsSync, writeFileSync, readFileSync } = require("fs");
const { join } = require("path");
const { generate } = require("ts-to-zod");

const configSchemaText = generate({ sourceText: readFileSync(join(__dirname, "..", "api", "types", "Config.ts")).toString() }).getZodSchemasFile();
writeFileSync(join(__dirname, "configSchema.js"), configSchemaText.replace("export const ", "").replace("export const ", "").replace("import { z } from \"zod\";", "const { z } = require(\"zod\");") + "\n" + "module.exports = { configSchema };");
const { configSchema } = require("./configSchema");

const devSchemaText = generate({ sourceText: readFileSync(join(__dirname, "..", "api", "types", "Dev.ts")).toString() }).getZodSchemasFile();
writeFileSync(join(__dirname, "devSchema.js"), devSchemaText.replace("export const ", "").replace("import { z } from \"zod\";", "const { z } = require(\"zod\");") + "\n" + "module.exports = { devSchema };");
const { devSchema } = require("./devSchema");

if (!existsSync(join("config.pmgf"))) {
    throw new Error("You must create a config.pmgf file for use with Pigeon Mode Game Framework.");
}
const configString = readFileSync(join("config.pmgf")).toString();
try {
    JSON.parse(configString);
}
catch (error) {
    throw new Error("Your config.pmgf file is not valid JSON.");
}
try {
    configSchema.parse(JSON.parse(configString));
}
catch (error) {
    console.error("Your config.pmgf file does not match the schema.");
    throw error;
}

if (!existsSync(join("dev.pmgf"))) {
    throw new Error("You must create a dev.pmgf file for use with Pigeon Mode Game Framework.");
}
const devString = readFileSync(join("dev.pmgf")).toString();
try {
    JSON.parse(devString);
}
catch (error) {
    throw new Error("Your dev.pmgf file is not valid JSON.");
}
try {
    devSchema.parse(JSON.parse(devString));
}
catch (error) {
    console.error("Your dev.pmgf file does not match the schema.");
    throw error;
}

require("./createGameTSConfig");

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