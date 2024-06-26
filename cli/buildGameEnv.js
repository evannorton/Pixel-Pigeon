let gameEnv = {};

require('dotenv').config({
  processEnv: gameEnv
});

if (process.env.GITHUB_ENV_VARS) {
  gameEnv = { ...gameEnv, ...JSON.parse(process.env.GITHUB_ENV_VARS) }
}

const { writeFileSync } = require("fs");
const { join, resolve } = require("path");

writeFileSync(join(resolve(), "out", "game-env.json"), JSON.stringify(gameEnv));