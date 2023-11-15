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

const envSchemaText = generate({ sourceText: readFileSync(join(__dirname, "..", "api", "types", "Env.ts")).toString() }).getZodSchemasFile();
writeFileSync(join(__dirname, "envSchema.js"), envSchemaText.replace("export const ", "").replace("import { z } from \"zod\";", "const { z } = require(\"zod\");") + "\n" + "module.exports = { envSchema };");
const { envSchema } = require("./envSchema");

if (!existsSync(join("pp-config.json"))) {
    throw new Error("You must create a pp-config.json file for use with Pixel Pigeon.");
}
const configString = readFileSync(join("pp-config.json")).toString();
try {
    JSON.parse(configString);
}
catch (error) {
    throw new Error("Your pp-config.json file is not valid JSON.");
}
try {
    configSchema.parse(JSON.parse(configString));
}
catch (error) {
    console.error("Your pp-config.json file does not match the schema.");
    throw error;
}

if (!existsSync(join("pp-dev.json"))) {
    throw new Error("You must create a pp-dev.json file for use with Pixel Pigeon.");
}
const devString = readFileSync(join("pp-dev.json")).toString();
try {
    JSON.parse(devString);
}
catch (error) {
    throw new Error("Your pp-dev.json file is not valid JSON.");
}
try {
    devSchema.parse(JSON.parse(devString));
}
catch (error) {
    console.error("Your pp-dev.json file does not match the schema.");
    throw error;
}

if (!existsSync(join("pp-env.json"))) {
    throw new Error("You must create a pp-env.json file for use with Pixel Pigeon.");
}
const envString = readFileSync(join("pp-env.json")).toString();
try {
    JSON.parse(envString);
}
catch (error) {
    throw new Error("Your pp-env.json file is not valid JSON.");
}
try {
    envSchema.parse(JSON.parse(envString));
}
catch (error) {
    console.error("Your pp-env.json file does not match the schema.");
    throw error;
}

require("./createGameTSConfig");

writeFileSync(join(__dirname, "type.json"), JSON.stringify(process.argv[2]));

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