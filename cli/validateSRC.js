const { existsSync } = require("fs");
const { join } = require("path");

if (!existsSync(join("src"))) {
  throw new Error("You must create an src folder for use with Pigeon Mode Game Library.");
}

if (!existsSync(join("src", "index.ts"))) {
  throw new Error("You must create an index.ts file in src for use with Pigeon Mode Game Library.");
}