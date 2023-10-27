const killPort = require("kill-port");
const nodemon = require("nodemon");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const { join, resolve, sep } = require("path");

const build = require("./buildCommand");

writeFileSync(join(__dirname, "watchExec.json"), JSON.stringify([build]));
writeFileSync(join(__dirname, "watchExecCompleted.json"), JSON.stringify(false));

const watcher = nodemon({
  delay: 1,
  exec: `node ${join(__dirname, "handleWatch")} || exit 1`,
  ext: "css,fnt,gif,js,json,mp3,mustache,png,ts,ttf,json,ldtk",
  stdout: true,
  stderr: true,
  watch: [
    "./src/",
    "./audio/",
    "./images/",
    "./node-modules/",
    "./package.json",
    "./package-lock.json",
    "./pp-config.json",
    "./pp-dev.json",
    "./pp-env.json",
    "./project.ldtk"
  ]
});

watcher.addListener("restart", (files) => {
  const absoluteDirPieces = resolve().split(sep);
  absoluteDirPieces[0] = absoluteDirPieces[0].toLowerCase();

  if (typeof files === "undefined") {
    files = [];
  }

  if (existsSync(join(__dirname, "watchModifiedFiles.json"))) {
    const modifiedFiles = JSON.parse(readFileSync(join(__dirname, "watchModifiedFiles.json")).toString());
    modifiedFiles.forEach((file) => {
      if (files.includes(file) === false) {
        files.push(file);
      }
    });
  }

  writeFileSync(join(__dirname, "watchModifiedFiles.json"), JSON.stringify(files));

  const filesPieces = [];

  files.forEach((file) => {
    const filePieces = file.split(sep);
    filePieces[0] = filePieces[0].toLowerCase();
    for (const absoluteDirPiece of absoluteDirPieces) {
      if (absoluteDirPiece === filePieces[0]) {
        filePieces.shift();
      }
      else {
        break;
      }
    }
    filesPieces.push(filePieces);
  });

  const buildRelatedFilePieces = filesPieces.find((filePieces) => {
    const joinedFilePieces = filePieces.join("/");
    if (filePieces[0] === "node_modules") {
      return true;
    }
    if (joinedFilePieces === "package.json") {
      return true;
    }
    if (joinedFilePieces === "package-lock.json") {
      return true;
    }
    if (joinedFilePieces === "pp-config.json") {
      return true;
    }
    if (joinedFilePieces === "pp-dev.json") {
      return true;
    }
    if (joinedFilePieces === "pp-env.json") {
      return true;
    }
    return false;
  });

  if (typeof buildRelatedFilePieces !== "undefined") {
    console.log(`Exiting dev script because of a change to ${buildRelatedFilePieces.join("/")}.`);
    watcher.emit("quit");
  }
  else {
    const commands = [];

    if (
      JSON.parse(readFileSync(join(__dirname, "watchExecCompleted.json")).toString()) === false
      || filesPieces.some((filePieces) => {
        const joinedFilePieces = filePieces.join("/");
        if (filePieces[0] === "src") {
          return joinedFilePieces.substring(joinedFilePieces.length - 3) === ".ts"
            || joinedFilePieces.substring(joinedFilePieces.length - 5) === ".json";
        }
        if (filePieces[0] === "audio") {
          return joinedFilePieces.substring(joinedFilePieces.length - 4) === ".mp3"
        }
        if (filePieces[0] === "images") {
          return joinedFilePieces.substring(joinedFilePieces.length - 4) === ".png"
        }
        if (joinedFilePieces === "style.css") {
          return true;
        }
        if (joinedFilePieces === "project.ldtk") {
          return true;
        }
        return false;
      })
    ) {
      commands.push(build);
    }
    else {
      commands.push("node ./node_modules/pixel-pigeon/cli/buildHTML")
    }

    writeFileSync(join(__dirname, "watchExec.json"), JSON.stringify(commands));
  }
});

watcher.addListener("quit", () => {
  killPort(3000).then(() => {
    process.exit();
  });
});