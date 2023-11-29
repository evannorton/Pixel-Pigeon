const { copyDirectorySync } = require("./utils");
const { join, resolve } = require("path");
const { readdirSync, writeFileSync, existsSync, mkdirSync } = require("fs");

if (!existsSync(join(resolve(), "images"))) {
  mkdirSync(join(resolve(), "out", "images"));
}
else {
  copyDirectorySync(join(resolve(), "images"), join(resolve(), "out", "images"));
}

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
logDirectory(join(resolve(), "out", "images"));
const formattedPaths = paths.map((path) => {
  const pathWithExtension = path.replace(join(resolve(), "images"), "").split("\\").join("/").substring(1);
  return pathWithExtension.substring(0, pathWithExtension.length - 4);
})
writeFileSync(join(resolve(), "out", "images.json"), JSON.stringify(formattedPaths));