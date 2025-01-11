const { join, resolve } = require("path");
const getNodeModulePath = require("./getNodeModulePath");
const randomString = require("./randomString");

const buildID = randomString();

const commands = [
    `node ${join(__dirname, "writeBuildID")} ${buildID}`,
    `node ${join(__dirname, "clearOutput")}`,
    `node ${join(__dirname, "verifyImagesChunks")}`,
    `node ${join(__dirname, "createLib")}`,
    `${getNodeModulePath([".bin", "tsc"])} --preserveWatchOutput --p ${join(resolve(), "src", "tsconfig.json")} --outDir ${join(__dirname, "..", "game-lib")}`,
    `${getNodeModulePath([".bin", "tsc"])} --preserveWatchOutput --p ${join(__dirname, "..", "hot-reload", "tsconfig.json")} --outDir ${join(__dirname, "..", "hot-reload-lib")}`,
    `${getNodeModulePath([".bin", "esbuild"])} ${join(__dirname, "..", "hot-reload-lib", "index.js")} --bundle --sourcemap --outfile=${join(resolve(), "out", "library-script.js")}`,
    `node ${join(__dirname, "buildGameBundle")}`,
    `node ${join(__dirname, "buildHTML")}`,
    `node ${join(__dirname, "buildNormalize")}`,
    `node ${join(__dirname, "buildToasts")}`,
    `node ${join(__dirname, "buildCSS")}`,
    `node ${join(__dirname, "buildFavicon")}`,
    `node ${join(__dirname, "buildCursors")}`,
    `node ${join(__dirname, "buildAudio")}`,
    `node ${join(__dirname, "buildImages")}`,
    `node ${join(__dirname, "buildMP3")}`,
    `node ${join(__dirname, "buildSVG")}`,
    `node ${join(__dirname, "buildFonts")}`,
    `node ${join(__dirname, "buildConfig")}`,
    `node ${join(__dirname, "buildDev")}`,
    `node ${join(__dirname, "buildID")}`,
    `node ${join(__dirname, "buildEnv")}`,
    `node ${join(__dirname, "buildGameEnv")}`,
    `node ${join(__dirname, "buildLDTK")}`,
    `node ${join(__dirname, "buildType")}`
];

const protectedCommands = [];

for (const command of commands) {
    protectedCommands.push(command);
    protectedCommands.push(`node ${join(__dirname, "checkBuildID")} ${buildID}`);
}

module.exports = protectedCommands.join(" && ");
