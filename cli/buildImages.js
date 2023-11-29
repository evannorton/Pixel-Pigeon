const { copyDirectorySync } = require("./utils");
const { join, resolve } = require("path");
const { readdirSync, writeFileSync, existsSync, mkdirSync, rmSync } = require("fs");

if (existsSync(join(resolve(), "out", "images"))) {
  rmSync(join(resolve(), "out", "images"), { recursive: true, force: true });
}

if (!existsSync(join(resolve(), "images"))) {
  mkdirSync(join(resolve(), "out", "images"));
}
else {
  copyDirectorySync(join(resolve(), "images"), join(resolve(), "out", "images"));
}

const paths = [];
const logDirectory = (source) => {
  for (const file of readdirSync(join(resolve(), "out", "images", ...source))) {
    if (file.includes(".")) {
      paths.push([...source, file]);
    }
    else {
      logDirectory([...source, file]);
    }
  }
};
logDirectory([]);
const formattedPaths = paths.map((path) => {
  const joined = path.join("/");
  return joined.substring(0, joined.lastIndexOf("."));
})
writeFileSync(join(resolve(), "out", "images.json"), JSON.stringify(formattedPaths));