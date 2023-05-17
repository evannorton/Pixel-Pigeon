import("nanoid").then(({ nanoid }) => {
  const { readFileSync, writeFileSync } = require("fs");
  const { join } = require("path");
  const Mustache = require("mustache");
  
  const runID = nanoid();

  writeFileSync(join(__dirname, "..", "run-id.json"), JSON.stringify(runID));
  
  const html = Mustache.render(readFileSync(join(__dirname, "..", "template.mustache")).toString(), {
    runID
  });
  
  writeFileSync(join("out", "index.html"), html);
});