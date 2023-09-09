const { join } = require("path");

module.exports = [
    `node ${join(__dirname, "clearOutput")}`,
    `node ${join(__dirname, "createLib")}`,
    `tsc --preserveWatchOutput --p ${join(__dirname, "..", "game-tsconfig.json")} --outDir ${join(__dirname, "..", "game-lib")}`,
    `tsc --preserveWatchOutput --p ${join(__dirname, "..", "hot-reload", "tsconfig.json")} --outDir ${join(__dirname, "..", "hot-reload-lib")}`,
    `esbuild ${join(__dirname, "..", "game-lib", "index.js")} --bundle --sourcemap --outfile=${join(__dirname, "..", "out", "game-script.js")}`,
    `esbuild ${join(__dirname, "..", "hot-reload-lib", "index.js")} --bundle --sourcemap --outfile=${join(__dirname, "..", "out", "library-script.js")}`,
    `node ${join(__dirname, "buildHTML")}`,
    `node ${join(__dirname, "buildNormalize")}`,
    `node ${join(__dirname, "buildCSS")}`,
    `node ${join(__dirname, "buildCursors")}`,
    `node ${join(__dirname, "buildAudio")}`,
    `node ${join(__dirname, "buildImages")}`,
    `node ${join(__dirname, "buildSVG")}`,
    `node ${join(__dirname, "buildFonts")}`,
    `node ${join(__dirname, "buildConfig")}`,
    `node ${join(__dirname, "buildLDTK")}`
].join(" && ");