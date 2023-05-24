#!/usr/bin/env node

const { existsSync, writeFileSync, readFileSync } = require("fs");
const { join } = require("path");
const { configSchema } = require('./configSchema');

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
catch(error) {
    throw new Error("Your pmgl.json file does not match the schema.");
}

if (!existsSync(join("src"))) {
    throw new Error("You must create an src folder for use with Pigeon Mode Game Library.");
}

if (!existsSync(join("src", "tsconfig.json"))) {
    throw new Error("You must create a tsconfig.json in the src folder for use with Pigeon Mode Game Library.");
}

switch (process.argv[2]) {
    case "build":
        require("./build");
        break;
    case "dev":
        require("./watch");
        break;
    default:
        console.log("xD");
        break;
}