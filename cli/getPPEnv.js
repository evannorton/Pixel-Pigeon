const { existsSync, readFileSync } = require("fs");
const { join, resolve } = require("path");

const getPPEnv = () => {
  let ppEnv = null;

  if (existsSync(join(resolve(), "pp-env.json"))) {
    try {
      ppEnv = JSON.parse(readFileSync(join(resolve(), "pp-env.json")).toString());
    } catch (error) {
      throw new Error("Your pp-env.json file is not valid JSON.");
    }
  }

  if (process.env.PP_ENV) {
    let ppEnvFromEnvironmentVariable;
    try {
      ppEnvFromEnvironmentVariable = JSON.parse(process.env.PP_ENV);
    } catch (error) {
      throw new Error("Your PP_ENV environment variable is not valid JSON.");
    }
    if (ppEnv !== null) {
      ppEnv = { ...ppEnv, ...ppEnvFromEnvironmentVariable };
    } else {
      ppEnv = ppEnvFromEnvironmentVariable;
    }
  }

  return ppEnv;
};

module.exports = getPPEnv;
