const { writeFileSync } = require("fs");
const { join } = require("path");

writeFileSync(join(__dirname, "watchExecCompleted.json"), JSON.stringify(true));
writeFileSync(join(__dirname, "watchModifiedFiles.json"), JSON.stringify([]));