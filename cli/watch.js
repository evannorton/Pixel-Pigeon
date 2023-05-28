const killPort = require("kill-port");
const nodemon = require("nodemon");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const { join, resolve, sep } = require("path");

const build = `node ./node_modules/pigeon-mode-game-library/cli/createLib && tsc --preserveWatchOutput --p ./node_modules/pigeon-mode-game-library/game-tsconfig.json --outDir ./node_modules/pigeon-mode-game-library/game-lib && tsc --preserveWatchOutput --p ./node_modules/pigeon-mode-game-library/hot-reload/tsconfig.json --outDir ./node_modules/pigeon-mode-game-library/hot-reload-lib && esbuild ./node_modules/pigeon-mode-game-library/game-lib/index.js --bundle --sourcemap --outfile=./node_modules/pigeon-mode-game-library/out/game-script.js && esbuild ./node_modules/pigeon-mode-game-library/hot-reload-lib/index.js --bundle --sourcemap --outfile=./node_modules/pigeon-mode-game-library/out/library-script.js && node ./node_modules/pigeon-mode-game-library/cli/buildHTML && node ./node_modules/pigeon-mode-game-library/cli/buildNormalize && node ./node_modules/pigeon-mode-game-library/cli/buildCSS`;

writeFileSync(join(__dirname, "watchExec.json"), JSON.stringify([build]));
writeFileSync(join(__dirname, "watchExecCompleted.json"), JSON.stringify(false));

const watcher = nodemon({
  delay: 1,
  exec: "node ./node_modules/pigeon-mode-game-library/cli/handleWatch || exit 1",
  ext: "css,fnt,gif,js,json,mp3,mustache,png,ts,ttf",
  stdout: true,
  stderr: true,
  watch: [
    "./src/",
    "./node-modules/",
    "./package.json",
    "./package-lock.json",
    "./pmgl.json"
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
    if (joinedFilePieces === "pmgl.json") {
      return true;
    }
    if (filePieces.length === 2 && filePieces[0] === "scripts") {
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

    if (JSON.parse(readFileSync(join(__dirname, "watchExecCompleted.json")).toString()) === false || filesPieces.some((filePieces) => {
      const joinedFilePieces = filePieces.join("/");
      if (filePieces[0] === "src") {
        return joinedFilePieces.substring(joinedFilePieces.length - 3) === ".ts"
          || joinedFilePieces.substring(joinedFilePieces.length - 5) === ".json";
      }
      return false;
    })) {
      commands.push(build);
    }

    writeFileSync(join(__dirname, "watchExec.json"), JSON.stringify(commands));
  }
});

watcher.addListener("quit", () => {
  killPort(3000).then(() => {
    process.exit();
  });
});