const { copyDirectorySync } = require("./utils");
const { join } = require("path");
const { existsSync, readdirSync, readFileSync, writeFileSync } = require("fs");
const { generate } = require("ts-to-zod");

const levelSchemaText = generate({ sourceText: readFileSync(join(__dirname, "..", "api", "interfaces", "LevelData.ts")).toString() }).getZodSchemasFile();
writeFileSync(join(__dirname, "levelSchema.js"), levelSchemaText.replace("import { z } from \"zod\";", "const { z } = require(\"zod\");") + "\n" + "module.exports = { levelSchema };");
const { levelSchema } = require("./levelSchema");

if (!existsSync(join("levels"))) {
  throw new Error("You must create a levels folder for use with Pigeon Mode Game Library.");
}

readdirSync(join("levels")).forEach((file) => {
    const levelString = readFileSync(join("levels", file)).toString();
    try {
        JSON.parse(levelString);
    }
    catch (error) {
        throw new Error(`Level ${file} is not valid JSON.`);
    }
    try {
        levelSchema.parse(JSON.parse(levelString));
    }
    catch (error) {
        throw new Error(`Level ${file} does not match the schema.`);
    }
});

copyDirectorySync(join(__dirname, "..", "..", "..", "levels"), join(__dirname, "..", "out", "levels"));