const { readFileSync, writeFileSync } = require("fs");
const { join, resolve } = require("path");
const Mustache = require("mustache");
const randomString = require("./randomString");
const getPPEnv = require("./getPPEnv");

const runID = randomString();

writeFileSync(join(__dirname, "..", "run-id.json"), JSON.stringify(runID));

const data = { runID };

const ppEnv = getPPEnv();

if (ppEnv !== null) {
  data.newgroundsAppID = ppEnv.newgroundsAppID;
  data.newgroundsEncryptionKey = ppEnv.newgroundsEncryptionKey;
}

const config = JSON.parse(readFileSync(join(resolve(), "pp-config.json")).toString());

data.name = config.name;

const html = Mustache.render(readFileSync(join(__dirname, "..", "template.mustache")).toString(), data);

writeFileSync(join(resolve(), "out", "index.html"), html);