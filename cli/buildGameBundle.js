const { buildSync } = require('esbuild');
const { join, resolve } = require("path");

buildSync({
  entryPoints: [join(__dirname, "..", "game-lib", "index.js")],
  bundle: true,
  sourcemap: true,
  outfile: join(resolve(), "out", "game-script.js"),
  nodePaths: [join(__dirname, "..", "node_modules"), join(resolve(), "node_modules")],
})