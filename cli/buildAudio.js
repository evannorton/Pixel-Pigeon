const { copyDirectorySync } = require("./utils");
const { join, resolve } = require("path");
const { readdirSync, writeFileSync, existsSync, mkdirSync, rmSync } = require("fs");

if (existsSync(join(resolve(), "out", "audio"))) {
  rmSync(join(resolve(), "out", "audio"), { recursive: true, force: true });
}

if (!existsSync(join(resolve(), "audio"))) {
  mkdirSync(join(resolve(), "out", "audio"));
}
else {
  copyDirectorySync(join(resolve(), "audio"), join(resolve(), "out", "audio"));
}

const paths = [];
const logDirectory = (source) => {
  for (const file of readdirSync(join(resolve(), "out", "audio", ...source))) {
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
writeFileSync(join(resolve(), "out", "audio.json"), JSON.stringify(formattedPaths));