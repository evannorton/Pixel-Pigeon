const { ESLint } = require("eslint");
const { resolve, join } = require("path");

const eslint = new ESLint({
  cwd: resolve(join()),
  overrideConfig: {
    parserOptions: {
      project: "./node_modules/pigeon-mode-game-library/game-tsconfig.json"
    },
    extends: [
      "./node_modules/pigeon-mode-game-library/.eslintrc"
    ]
  }
});

eslint.lintFiles("./src").then((results) => {
  for (const result of results) {
    for (const message of result.messages) {
      console.error(`${result.filePath}:${message.line}:${message.column} ${message.message} (${message.ruleId})`);
    }
  }
});