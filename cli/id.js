import("nanoid").then(({nanoid}) => {
  const { writeFileSync } = require("fs");
  const { join, resolve } = require("path");
  
  const id = nanoid();
  
  writeFileSync(join(resolve(), "pp-id.json"), JSON.stringify(id));
})