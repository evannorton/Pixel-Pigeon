const { copyDirectorySync } = require("./utils");
const { join } = require("path");
const { readdirSync, writeFileSync } = require("fs");

copyDirectorySync(join(__dirname, "..", "..", "..", "audio"), join(__dirname, "..", "out", "audio"));

const paths = [];
const logDirectory = (source) => {
  for (const file of readdirSync(source)) {
    if (file.includes(".")) {
      paths.push(join(source, file));
    }
    else {
      logDirectory(join(source, file));
    }
  }
};
logDirectory(join(__dirname, "..", "..", "..", "audio"));
const formattedPaths = paths.map((path) => {
  const pathWithExtension = path.replace(join(__dirname, "..", "..", "..", "audio"), "").split("\\").join("/").substring(1);
  return pathWithExtension.substring(0, pathWithExtension.length - 4);
})
writeFileSync(join(__dirname, "..", "out", "audio.json"), JSON.stringify(formattedPaths));