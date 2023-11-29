const { copyDirectorySync } = require("./utils");
const { join, resolve } = require("path");
const { readdirSync, writeFileSync, existsSync, mkdirSync } = require("fs");

if (!existsSync(join(resolve(), "audio"))) {
  mkdirSync(join(resolve(), "out", "audio"));
}
else {
  copyDirectorySync(join(resolve(), "audio"), join(resolve(), "out", "audio"));
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
logDirectory(join(resolve(), "out", "audio"));
const formattedPaths = paths.map((path) => {
  const pathWithExtension = path.replace(join(resolve(), "audio"), "").split("\\").join("/").substring(1);
  return pathWithExtension.substring(0, pathWithExtension.length - 4);
})
writeFileSync(join(resolve(), "out", "audio.json"), JSON.stringify(formattedPaths));