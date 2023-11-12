const killPort = require("kill-port");
const { watch, readFileSync, writeFileSync } = require("fs");
const { join, resolve, sep } = require("path");
const { debounce } = require("throttle-debounce");
const { spawn } = require("child_process");

const build = require("./buildCommand");

writeFileSync(join(__dirname, "watchExec.json"), JSON.stringify([build]));
writeFileSync(
  join(__dirname, "watchExecCompleted.json"),
  JSON.stringify(false)
);

const extensions = [
  "css",
  "fnt",
  "gif",
  "js",
  "json",
  "mp3",
  "mustache",
  "png",
  "ts",
  "ttf",
  "json",
  "ldtk",
];

watch(".", { recursive: true }, (_, filename) => {
  if (filename !== null) {
    const split = filename.split(".");
    const ext = split[split.length - 1];
    if (filename.startsWith(`node_modules${sep}pixel-pigeon`)) return;
    if (extensions.includes(ext)) {
      addFile(filename);
    }
  }
});

const hardRestart = () => {
  handler.kill();
  process.exit();
};

const start = () => {
  const command = spawn("node", [join(__dirname, "handleWatch")]);

  command.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  command.stderr.on("data", (data) => {
    console.error(data.toString());
  });
  return command;
};
let handler = start();

const restart = () => {
  console.warn("Hot reloading...");
  setTimeout(() => {
    killPort(3000)
      .catch(() => { })
      .finally(() => {
        handler.kill();
        handler = start();
      });
  }, 0);
};

let files = [];

const addFile = (file) => {
  files.push(file);
  batchedReloading();
};

const batchedReloading = debounce(1000, () => {
  restart();
  const absoluteDirPieces = resolve().split(sep);
  absoluteDirPieces[0] = absoluteDirPieces[0].toLowerCase();

  const filesPieces = [];

  files.forEach((file) => {
    const filePieces = file.split(sep);
    filePieces[0] = filePieces[0].toLowerCase();
    for (const absoluteDirPiece of absoluteDirPieces) {
      if (absoluteDirPiece === filePieces[0]) {
        filePieces.shift();
      } else {
        break;
      }
    }
    filesPieces.push(filePieces);
  });

  const buildRelatedFilePieces = filesPieces.find((filePieces) => {
    const joinedFilePieces = filePieces.join(sep);
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
    console.log(
      `Exiting dev script because of a change to ${buildRelatedFilePieces.join(
        "/"
      )}.`
    );
    hardRestart();
  } else {
    const commands = [];

    if (
      JSON.parse(
        readFileSync(join(__dirname, "watchExecCompleted.json")).toString()
      ) === false ||
      filesPieces.some((filePieces) => {
        const joinedFilePieces = filePieces.join("/");
        if (filePieces[0] === "src") {
          return (
            joinedFilePieces.substring(joinedFilePieces.length - 3) === ".ts" ||
            joinedFilePieces.substring(joinedFilePieces.length - 5) === ".json"
          );
        }
        if (filePieces[0] === "audio") {
          return (
            joinedFilePieces.substring(joinedFilePieces.length - 4) === ".mp3"
          );
        }
        if (filePieces[0] === "images") {
          return (
            joinedFilePieces.substring(joinedFilePieces.length - 4) === ".png"
          );
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
    } else {
      commands.push("node ./node_modules/pixel-pigeon/cli/buildHTML");
    }

    writeFileSync(join(__dirname, "watchExec.json"), JSON.stringify(commands));
    files = [];
  }
});
