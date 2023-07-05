const { copyDirectorySync } = require("./utils");
const { join } = require("path");
const { readdirSync, writeFileSync } = require("fs");

copyDirectorySync(join(__dirname, "..", "..", "..", "images"), join(__dirname, "..", "out", "images"));

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
logDirectory(join(__dirname, "..", "..", "..", "images"));
const formattedPaths = paths.map((path) => {
  const pathWithExtension = path.replace(join(__dirname, "..", "..", "..", "images"), "").split("\\").join("/").substring(1);
  return pathWithExtension.substring(0, pathWithExtension.length - 4);
})
writeFileSync(join(__dirname, "..", "out", "images.json"), JSON.stringify(formattedPaths));