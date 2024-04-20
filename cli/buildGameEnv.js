const gameEnv = {};
console.log(process.env);
require('dotenv').config({
  processEnv: gameEnv
});
const { writeFileSync } = require("fs");
const { join, resolve } = require("path");

console.log("yo");
console.log(gameEnv);

writeFileSync(join(resolve(), "out", "game-env.json"), JSON.stringify(gameEnv));