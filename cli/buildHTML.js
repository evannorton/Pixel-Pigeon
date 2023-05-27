import("nanoid").then(({ nanoid }) => {
  const { readFileSync, writeFileSync } = require("fs");
  const { join } = require("path");
  const Mustache = require("mustache");
  
  const runID = nanoid();

  writeFileSync(join(__dirname, "..", "run-id.json"), JSON.stringify(runID));
  
  const html = Mustache.render(readFileSync(join(__dirname, "..", "template.mustache")).toString(), {
    config : readFileSync(join(__dirname, "..", "..", "..", "pmgl.json")).toString(),
    runID
  });
  
  writeFileSync(join(__dirname, "..", "out", "index.html"), html);
});