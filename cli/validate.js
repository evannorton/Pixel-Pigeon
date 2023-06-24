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