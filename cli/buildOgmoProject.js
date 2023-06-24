const { copyFileSync } = require("fs");
const { join, resolve } = require("path");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const { generate } = require("ts-to-zod");

const ogmoSchemaText = generate({ sourceText: readFileSync(join(__dirname, "..", "api", "interfaces", "Ogmo.ts")).toString() }).getZodSchemasFile();
writeFileSync(join(__dirname, "ogmoSchema.js"), ogmoSchemaText.replace("import { z } from \"zod\";", "const { z } = require(\"zod\");") + "\n" + "module.exports = { ogmoSchema };");
const { ogmoSchema } = require("./ogmoSchema");

if (!existsSync(join("project.ogmo"))) {
  throw new Error("You must create a project.ogmo file for use with Pigeon Mode Game Library.");
}
const ogmoString = readFileSync(join("project.ogmo")).toString();
try {
  JSON.parse(ogmoString);
}
catch (error) {
  throw new Error("Your project.ogmo file is not valid JSON.");
}
try {
  ogmoSchema.parse(JSON.parse(ogmoString));
}
catch (error) {
  throw new Error("Your project.ogmo file does not match the schema.");
}

copyFileSync(resolve(join(__dirname, "..", "..", "..", "project.ogmo")), resolve(join(__dirname, "..", "out", "project.ogmo")))