import("nanoid").then(({ nanoid }) => {
  const { readFileSync, writeFileSync } = require("fs");
  const { join, resolve } = require("path");
  const Mustache = require("mustache");

  const runID = nanoid();

  writeFileSync(join(__dirname, "..", "run-id.json"), JSON.stringify(runID));

  const res = JSON.parse(readFileSync(join(resolve(), "pp-env.json")).toString());

  const html = Mustache.render(readFileSync(join(__dirname, "..", "template.mustache")).toString(), {
    runID,
    newgroundsAppID: res.newgroundsAppID,
    newgroundsEncryptionKey: res.newgroundsEncryptionKey
  });

  writeFileSync(join(__dirname, "..", "out", "index.html"), html);
});