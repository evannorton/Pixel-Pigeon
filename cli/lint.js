const { ESLint } = require("eslint");
const { join } = require("path");

const eslint = new ESLint({
  cwd: join(__dirname, "..", "..", ".."),
  overrideConfig: {
    "parserOptions": {
      "project": "./src/tsconfig.json"
    },
    "extends": [
      "./node_modules/pigeon-mode-game-library/.eslintrc",
    ],
  }
});

eslint.lintFiles("./src/index.ts").then((results) => {
  for (const result of results) {
    for (const message of result.messages) {
      console.error(`${result.filePath}:${message.line}:${message.column} ${message.message} (${message.ruleId})`);
    }
  }
});