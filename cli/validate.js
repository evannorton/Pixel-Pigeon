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

// Validate levels

const ogmoLevelSchemaText = generate({ sourceText: readFileSync(join(__dirname, "..", "api", "interfaces", "ogmo", "OgmoLevel.ts")).toString() }).getZodSchemasFile();
writeFileSync(join(__dirname, "levelSchema.js"), ogmoLevelSchemaText.replace("import { z } from \"zod\";", "const { z } = require(\"zod\");") + "\n" + "module.exports = { ogmoLevelSchema };");
const { ogmoLevelSchema } = require("./levelSchema");

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
    ogmoLevelSchema.parse(JSON.parse(levelString));
  }
  catch (error) {
    throw new Error(`Level ${file} does not match the schema.`);
  }
});

// Validate Ogmo project

const ogmoProjectSchemaText = generate({ sourceText: readFileSync(join(__dirname, "..", "api", "interfaces", "ogmo", "OgmoProject.ts")).toString() }).getZodSchemasFile();
writeFileSync(join(__dirname, "ogmoSchema.js"), ogmoProjectSchemaText.replace("import { z } from \"zod\";", "const { z } = require(\"zod\");") + "\n" + "module.exports = { ogmoProjectSchema };");
const { ogmoProjectSchema } = require("./ogmoSchema");

if (!existsSync(join("project.ogmo"))) {
  throw new Error("You must create a project.ogmo file for use with Pigeon Mode Game Library.");
}
const ogmoProjectString = readFileSync(join("project.ogmo")).toString();
try {
  const ogmoProjectJSON = JSON.parse(ogmoProjectString);
  const ogmoProjectTilesetLabels = new Map;
  for (const ogmoProjectTileset of ogmoProjectJSON.tilesets) {
    if (ogmoProjectTilesetLabels.has(ogmoProjectTileset.label.toLowerCase())) {
      throw new Error(`You have two Ogmo tilesets with the same label: ${ogmoProjectTileset.label}`);
    }
    ogmoProjectTilesetLabels.set(ogmoProjectTileset.label.toLowerCase(), true);
    if (ogmoProjectTileset.path.substring(0, 7) !== "images/") {
      throw new Error(`Ogmo tileset ${ogmoProjectTileset.label} is using an image that is not in the images folder: ${ogmoProjectTileset.path}`);
    }
  }
}
catch (error) {
  throw new Error("Your project.ogmo file is not valid JSON.");
}
try {
  ogmoProjectSchema.parse(JSON.parse(ogmoProjectString));
}
catch (error) {
  throw new Error("Your project.ogmo file does not match the schema.");
}