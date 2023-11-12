const { join } = require("path");
const nodeModulesPath = require("./nodeModulesPath");
const randomString = require("./randomString");

const buildID = randomString();

const commands = [
    `node ${join(__dirname, "writeBuildID")} ${buildID}`,
    `node ${join(__dirname, "clearOutput")}`,
    `node ${join(__dirname, "createLib")}`,
    `${join(nodeModulesPath, ".bin", "tsc")} --preserveWatchOutput --p ${join(__dirname, "..", "game-tsconfig.json")} --outDir ${join(__dirname, "..", "game-lib")}`,
    `${join(nodeModulesPath, ".bin", "tsc")} --preserveWatchOutput --p ${join(__dirname, "..", "hot-reload", "tsconfig.json")} --outDir ${join(__dirname, "..", "hot-reload-lib")}`,
    `${join(nodeModulesPath, ".bin", "esbuild")} ${join(__dirname, "..", "hot-reload-lib", "index.js")} --bundle --sourcemap --outfile=${join(__dirname, "..", "out", "library-script.js")}`,
    `node ${join(__dirname, "buildGameBundle")}`,
    `node ${join(__dirname, "buildHTML")}`,
    `node ${join(__dirname, "buildNormalize")}`,
    `node ${join(__dirname, "buildCSS")}`,
    `node ${join(__dirname, "buildCursors")}`,
    `node ${join(__dirname, "buildAudio")}`,
    `node ${join(__dirname, "buildImages")}`,
    `node ${join(__dirname, "buildMP3")}`,
    `node ${join(__dirname, "buildSVG")}`,
    `node ${join(__dirname, "buildFonts")}`,
    `node ${join(__dirname, "buildConfig")}`,
    `node ${join(__dirname, "buildDev")}`,
    `node ${join(__dirname, "buildEnv")}`,
    `node ${join(__dirname, "buildLDTK")}`
];

const protectedCommands = [];

for (const command of commands) {
    protectedCommands.push(command);
    protectedCommands.push(`node ${join(__dirname, "checkBuildID")} ${buildID}`);
}

module.exports = protectedCommands.join(" && ");
