const { readFileSync, writeFileSync, existsSync } = require("fs");
const { join, resolve } = require("path");
const Mustache = require("mustache");
const randomString = require("./randomString");

const runID = randomString();

writeFileSync(join(__dirname, "..", "run-id.json"), JSON.stringify(runID));

const data = { runID };

if (existsSync(join(resolve(), "pp-env.json"))) {
  const res = JSON.parse(readFileSync(join(resolve(), "pp-env.json")).toString());
  data.newgroundsAppID = res.newgroundsAppID;
  data.newgroundsEncryptionKey = res.newgroundsEncryptionKey;
}

const config = JSON.parse(readFileSync(join(resolve(), "pp-config.json")).toString());

data.name = config.name;

const html = Mustache.render(readFileSync(join(__dirname, "..", "template.mustache")).toString(), data);

writeFileSync(join(resolve(), "out", "index.html"), html);