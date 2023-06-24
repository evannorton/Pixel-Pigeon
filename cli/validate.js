const { existsSync, readdirSync, readFileSync, writeFileSync } = require("fs");
const { join } = require("path");
const { generate } = require("ts-to-zod");

// Validate source code

if (!existsSync(join("src"))) {
  throw new Error("You must create an src folder for use with Pigeon Mode Game Library.");
}

if (!existsSync(join("src", "index.ts"))) {
  throw new Error("You must create an index.ts file in src for use with Pigeon Mode Game Library.");
}

// Validate images

if (!existsSync(join("images"))) {
    throw new Error("You must create an images folder for use with Pigeon Mode Game Library.");
}

// Validate ldtk

if (!existsSync(join("project.ldtk"))) {
  throw new Error("You must create a project.ldtk file for use with Pigeon Mode Game Library.");
}
const configString = readFileSync(join("project.ldtk")).toString();
try {
  JSON.parse(configString);
}
catch (error) {
  throw new Error("Your project.ldtk file is not valid JSON.");
}
const configSchemaText = generate({ sourceText: readFileSync(join(__dirname, "..", "api", "types", "LDTK.ts")).toString() }).getZodSchemasFile();
writeFileSync(join(__dirname, "ldtkSchema.js"), configSchemaText.replace("import { z } from \"zod\";", "const { z } = require(\"zod\");") + "\n" + "module.exports = { ldtkSchema };");
const { ldtkSchema } = require("./ldtkSchema");
try {
  ldtkSchema.parse(JSON.parse(configString));
}
catch (error) {
    console.error("Your project.ldtk file does not match the schema.");
    throw error;
}