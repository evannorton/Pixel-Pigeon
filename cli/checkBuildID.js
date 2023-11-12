const { readFileSync } = require("fs");
const { argv } = require("process");
const { join } = require("path");

const buildID = argv[2];

const writtenBuildID = JSON.parse(readFileSync(join(__dirname, "build-id.json")).toString());

if (buildID !== writtenBuildID) {
  throw new Error("Exiting build because another build was started concurrently.");
}