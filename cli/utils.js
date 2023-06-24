const { existsSync, mkdirSync, readdirSync, copyFileSync } = require("fs");
const { join } = require("path");

const copyDirectorySync = (source, destination) => {
  console.log(source);
  if (!existsSync(destination)) {
    mkdirSync(destination);
  }
  for (const file of readdirSync(source)) {
    if (file.includes(".")) {
      copyFileSync(join(source, file), join(destination, file));
    }
    else {
      copyDirectorySync(join(source, file), join(destination, file));
    }
  }
};

module.exports = { copyDirectorySync }